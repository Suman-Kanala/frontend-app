import { NextRequest, NextResponse } from 'next/server';

export interface MatchedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;          // internal only – never shown to user
  type: string;
  postedAt: string;
  daysAgo: number;
  matchScore: number;
  matchLabel: string;
  description?: string;
  source?: string;      // e.g. "Indeed · UK", "Naukri · India"
}

/* ─── Internal shape before scoring ─────────────────────────── */
type RawJob = Omit<MatchedJob, 'matchScore' | 'matchLabel'>;

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

/* ─── Adzuna country map ─────────────────────────────────────── */
// Adzuna aggregates Indeed, Reed, Totaljobs, Glassdoor, Naukri, Seek,
// Monster, CareerBuilder and many more per country
const ADZUNA_COUNTRY_MAP: Record<string, string> = {
  IN: 'in',   // Naukri, TimesJobs, Shine
  US: 'us',   // Indeed, CareerBuilder, ZipRecruiter
  GB: 'gb',   // Reed, Totaljobs, Guardian Jobs
  AU: 'au',   // Seek, CareerOne
  CA: 'ca',   // Workopolis, Indeed Canada
  DE: 'de',   // StepStone, Indeed Germany
  SG: 'sg',   // JobsDB, Indeed Singapore
  // AE (UAE) not supported by Adzuna — falls back to global remote sources
};

/* ─── Helpers ────────────────────────────────────────────────── */
function isRecent(dateStr: string | undefined): boolean {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;
  return Date.now() - d.getTime() <= FOURTEEN_DAYS_MS;
}

function daysAgo(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000));
}

function calcMatch(
  job: { title: string; company: string; description?: string },
  role: string,
  skills: string[],
  experience: string
): number {
  const roleWords  = role.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const skillWords = skills.map(s => s.toLowerCase().trim()).filter(Boolean);

  const allKeywords = [...new Set([...roleWords, ...skillWords])];
  const text        = `${job.title} ${job.company} ${job.description ?? ''}`.toLowerCase();
  const titleLower  = job.title.toLowerCase();

  // Keyword overlap (60 pts max)
  const matched   = allKeywords.filter(kw => text.includes(kw));
  const baseScore = allKeywords.length > 0 ? (matched.length / allKeywords.length) * 60 : 30;

  // Title match (+10 per role word found in title)
  const titleBonus = roleWords.filter(w => titleLower.includes(w)).length * 10;

  // Experience level alignment: +15 match, −15 heavy mismatch
  const expStr    = experience.toLowerCase();
  const isFresher = expStr.includes('0') || expStr.includes('fresher') || expStr.includes('1–3') || expStr.includes('1-3');
  const isMid     = expStr.includes('3') || expStr.includes('5');
  const isSenior  = expStr.includes('7') || expStr.includes('10') || expStr.includes('senior');

  const jobSenior = /\b(senior|sr\.?|lead|principal|staff|head|director|manager|vp|architect)\b/.test(titleLower);
  const jobJunior = /\b(junior|jr\.?|entry[\s-]level|fresher|graduate|associate|intern|trainee)\b/.test(titleLower);

  let expScore = 0;
  if (isFresher)     expScore = jobJunior ? 15 : jobSenior ? -15 : 5;
  else if (isMid)    expScore = jobSenior ? 5  : jobJunior ? -8  : 12;
  else if (isSenior) expScore = jobSenior ? 15 : jobJunior ? -10 : 8;

  return Math.min(99, Math.max(22, Math.round(baseScore + titleBonus + expScore)));
}

function matchLabel(score: number): string {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Partial Match';
}

/* ─── Adzuna (trusted aggregator — Indeed, Reed, Naukri, etc.) ── */
async function fetchAdzuna(role: string, countryCode: string): Promise<RawJob[]> {
  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const country = ADZUNA_COUNTRY_MAP[countryCode];
  if (!country) return [];

  const SOURCE_LABEL: Record<string, string> = {
    in: 'Naukri / Indeed India',
    us: 'Indeed US',
    gb: 'Reed / Indeed UK',
    au: 'Seek / Indeed AU',
    ca: 'Indeed Canada',
    de: 'StepStone / Indeed DE',
    sg: 'JobsDB / Indeed SG',
  };

  try {
    const q   = encodeURIComponent(role);
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${q}&content-type=application/json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!res.ok) {
      console.error(`[Adzuna/${country}] HTTP ${res.status}`, await res.text().catch(() => ''));
      return [];
    }
    const data = await res.json();
    console.log(`[Adzuna/${country}] ${data.results?.length ?? 0} results for "${role}"`);
    return (data.results ?? [])
      .filter((j: any) => isRecent(j.created))
      .map((j: any): RawJob => ({
        id:          `adz-${country}-${j.id}`,
        title:       j.title,
        company:     j.company?.display_name || 'Unknown',
        location:    j.location?.display_name || j.location?.area?.join(', ') || countryCode,
        url:         j.redirect_url,
        type:        j.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
        postedAt:    j.created,
        daysAgo:     daysAgo(j.created),
        description: j.description?.slice(0, 400),
        source:      SOURCE_LABEL[country] || `Adzuna · ${country.toUpperCase()}`,
      }));
  } catch { return []; }
}

/* ─── Remotive (fallback when no Adzuna keys) ────────────────── */
async function fetchRemotive(role: string): Promise<RawJob[]> {
  try {
    const q   = encodeURIComponent(role);
    const res = await fetch(`https://remotive.com/api/remote-jobs?search=${q}&limit=30`, {
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs ?? [])
      .filter((j: any) => isRecent(j.publication_date))
      .map((j: any): RawJob => ({
        id:          `rm-${j.id}`,
        title:       j.title,
        company:     j.company_name,
        location:    j.candidate_required_location || 'Remote / Worldwide',
        url:         j.url,
        type:        j.job_type?.replace(/_/g, ' ') || 'Full-time',
        postedAt:    j.publication_date,
        daysAgo:     daysAgo(j.publication_date),
        description: j.description?.replace(/<[^>]+>/g, ' ').slice(0, 400),
        source:      'Remotive',
      }));
  } catch { return []; }
}

/* ─── Arbeitnow (free, international remote jobs) ────────────── */
async function fetchArbeitnow(role: string): Promise<RawJob[]> {
  try {
    const tag = encodeURIComponent(role.split(' ')[0]);
    const res = await fetch(`https://www.arbeitnow.com/api/job-board-api?search=${tag}`, {
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? [])
      .filter((j: any) => isRecent(j.created_at ? new Date(j.created_at * 1000).toISOString() : undefined))
      .slice(0, 20)
      .map((j: any): RawJob => {
        const postedAt = j.created_at ? new Date(j.created_at * 1000).toISOString() : '';
        return {
          id:          `anow-${j.slug}`,
          title:       j.title,
          company:     j.company_name,
          location:    j.location || 'Remote / Europe',
          url:         j.url,
          type:        j.remote ? 'Remote' : 'Full-time',
          postedAt,
          daysAgo:     daysAgo(postedAt),
          description: j.description?.replace(/<[^>]+>/g, ' ').slice(0, 400),
          source:      'Arbeitnow',
        };
      });
  } catch { return []; }
}

/* ─── Route ──────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { role, skills, experience, countries = [] } = await req.json();
    if (!role) return NextResponse.json({ error: 'Role is required' }, { status: 400 });

    const hasAdzuna = !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY);

    let results: RawJob[];

    if (hasAdzuna && countries.length > 0) {
      // Fetch from Adzuna for each selected country in parallel
      // Adzuna handles country filtering — do NOT mix in European-only sources
      const adzunaResults = await Promise.all(
        countries.map((c: string) => fetchAdzuna(role, c))
      );
      results = adzunaResults.flat();

      // If Adzuna returned nothing (API issue / no results), fall back gracefully
      if (results.length === 0) {
        const [remotive, arbeitnow] = await Promise.all([
          fetchRemotive(role),
          fetchArbeitnow(role),
        ]);
        results = [...remotive, ...arbeitnow];
      }
    } else {
      // Fallback: use free public APIs
      const [remotive, arbeitnow] = await Promise.all([
        fetchRemotive(role),
        fetchArbeitnow(role),
      ]);
      results = [...remotive, ...arbeitnow];
    }

    // Deduplicate by title|company key
    const seen = new Set<string>();
    const raw: RawJob[] = [];
    for (const job of results) {
      const key = `${job.title}|${job.company}`.toLowerCase();
      if (!seen.has(key)) { seen.add(key); raw.push(job); }
    }

    // Score + sort
    const scored: MatchedJob[] = raw
      .map(job => ({
        ...job,
        matchScore: calcMatch(job, role, skills ?? [], experience ?? ''),
        matchLabel: '',
      }))
      .map(job => ({ ...job, matchLabel: matchLabel(job.matchScore) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 40);

    return NextResponse.json({ jobs: scored, total: scored.length });
  } catch (err) {
    console.error('[job-finder/jobs]', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
