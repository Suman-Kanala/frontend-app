import { NextResponse } from 'next/server';

export const revalidate = 21600; // 6 hours

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate?: string;
}

// ── Feed config ──────────────────────────────────────────────────────────────
// Google News RSS: reliable, server-side accessible, geo-targeted, no API key

const GN = (q: string, country: 'IN' | 'US') =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-${country}&gl=${country}&ceid=${country}:en`;

// 70 % — Indian IT job vacancies (7 domains × 2 items = 14)
const INDIA_FEEDS = [
  { url: GN('software developer jobs vacancy hiring India 2025', 'IN'), source: '🇮🇳 Software Jobs – India', limit: 2 },
  { url: GN('data science machine learning AI jobs India vacancy', 'IN'),  source: '🇮🇳 Data Science – India',  limit: 2 },
  { url: GN('DevOps cloud AWS Azure jobs hiring India',             'IN'),  source: '🇮🇳 Cloud & DevOps – India', limit: 2 },
  { url: GN('React Angular frontend developer jobs India',           'IN'),  source: '🇮🇳 Frontend Jobs – India',  limit: 2 },
  { url: GN('QA automation testing engineer jobs India vacancy',    'IN'),  source: '🇮🇳 QA & Testing – India',   limit: 2 },
  { url: GN('Android iOS mobile developer jobs India hiring',        'IN'),  source: '🇮🇳 Mobile Dev – India',     limit: 2 },
  { url: GN('cybersecurity information security jobs India',         'IN'),  source: '🇮🇳 Cybersecurity – India',  limit: 2 },
];

// 10 % — US IT job vacancies (2 items)
const US_FEEDS = [
  { url: GN('software engineer jobs hiring USA 2025',               'US'),  source: '🇺🇸 Tech Jobs – USA',  limit: 1 },
  { url: GN('data scientist machine learning engineer jobs USA',    'US'),  source: '🇺🇸 Data Jobs – USA',  limit: 1 },
];

// 10 % — Tech & AI news (2 items)
const NEWS_FEEDS = [
  { url: GN('artificial intelligence technology news India',         'IN'),  source: '🤖 AI News',     limit: 1 },
  { url: GN('IT technology startup news India 2025',                 'IN'),  source: '📰 Tech News',   limit: 1 },
];

// ── RSS parser ───────────────────────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i').exec(xml);
  if (cdata) return cdata[1].trim();
  const plain = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i').exec(xml);
  return plain ? plain[1].trim() : '';
}

function extractLink(xml: string): string {
  // Google News wraps the real URL inside <a href> inside CDATA — fall back to guid
  const atom = /<link[^>]+rel="alternate"[^>]+href="([^"]+)"/.exec(xml);
  if (atom) return atom[1].trim();
  const plain = /<link>([^<]+)<\/link>/.exec(xml);
  if (plain) return plain[1].trim();
  return extractTag(xml, 'guid');
}

function parseRSS(xml: string, source: string, limit: number): NewsItem[] {
  const items: NewsItem[] = [];
  const re = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null && items.length < limit) {
    const block = m[1];
    const title = extractTag(block, 'title');
    const link  = extractLink(block);
    const pubDate = extractTag(block, 'pubDate');
    if (title && link && link.startsWith('http')) {
      items.push({ title, link, source, pubDate: pubDate || undefined });
    }
  }
  return items;
}

async function fetchFeed(url: string, source: string, limit: number): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 21600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SaanviCareers/1.0; +https://saanvicareers.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    return parseRSS(await res.text(), source, limit);
  } catch {
    return [];
  }
}

// ── Interleave builder ───────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const [indiaResults, usResults, newsResults] = await Promise.all([
    Promise.all(INDIA_FEEDS.map(f => fetchFeed(f.url, f.source, f.limit))),
    Promise.all(US_FEEDS.map(f  => fetchFeed(f.url, f.source, f.limit))),
    Promise.all(NEWS_FEEDS.map(f => fetchFeed(f.url, f.source, f.limit))),
  ]);

  const india = indiaResults.flat(); // up to 14
  const us    = usResults.flat();    // up to 2
  const tech  = newsResults.flat();  // up to 2

  // Interleave: per 10 slots → 7 India, 1 US, 1 Tech, 1 India
  const result: NewsItem[] = [];
  let ii = 0, ui = 0, ti = 0;
  const total = india.length + us.length + tech.length;

  for (let pos = 0; pos < total; pos++) {
    const slot = pos % 10;
    if (slot < 7 && ii < india.length)       result.push(india[ii++]);
    else if (slot === 7 && ui < us.length)    result.push(us[ui++]);
    else if (slot === 8 && ti < tech.length)  result.push(tech[ti++]);
    else if (ii < india.length)               result.push(india[ii++]);
    else if (ui < us.length)                  result.push(us[ui++]);
    else if (ti < tech.length)                result.push(tech[ti++]);
  }

  if (result.length === 0) {
    return NextResponse.json({ error: 'No data available' }, { status: 503 });
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600' },
  });
}
