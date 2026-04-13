import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1 hour

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  type: string;
  postedAt?: string;
}

// ── Remotive (free, no key) ───────────────────────────────────────────────────
// Covers: software, data, devops, frontend, QA — relevant to IT recruitment

const REMOTIVE_SEARCHES = [
  { q: 'software+engineer',  label: 'Eng' },
  { q: 'react+developer',    label: 'Frontend' },
  { q: 'data+scientist',     label: 'Data' },
  { q: 'devops+cloud',       label: 'DevOps' },
  { q: 'backend+developer',  label: 'Backend' },
];

async function fetchRemotive(): Promise<JobItem[]> {
  try {
    const results = await Promise.all(
      REMOTIVE_SEARCHES.map(async ({ q }) => {
        const res = await fetch(
          `https://remotive.com/api/remote-jobs?search=${q}&limit=5`,
          { signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.jobs || []).slice(0, 5).map((j: any): JobItem => ({
          id: `rm-${j.id}`,
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || 'Remote',
          url: j.url,
          type: j.job_type?.replace(/_/g, ' ') || 'Full-time',
          postedAt: j.publication_date,
        }));
      })
    );
    return results.flat();
  } catch {
    return [];
  }
}

// ── Jobicy (free, no key) ─────────────────────────────────────────────────────
async function fetchJobicy(): Promise<JobItem[]> {
  try {
    const res = await fetch(
      'https://jobicy.com/api/v2/remote-jobs?count=20&tag=dev',
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map((j: any): JobItem => ({
      id: `jc-${j.id}`,
      title: j.jobTitle,
      company: j.companyName,
      location: j.jobGeo || 'Remote',
      url: j.url,
      type: Array.isArray(j.jobType) ? j.jobType[0] : (j.jobType || 'Full-time'),
      postedAt: j.pubDate,
    }));
  } catch {
    return [];
  }
}

// ── RemoteOK (free, no key) ───────────────────────────────────────────────────
async function fetchRemoteOK(): Promise<JobItem[]> {
  try {
    const res = await fetch(
      'https://remoteok.com/api?tags=dev,engineer,software',
      {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'SaanviCareers/1.0 (https://saanvicareers.com)' },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // First item is usually a legal notice object — skip non-job entries
    return (data as any[])
      .filter((j) => j.position && j.company && j.url)
      .slice(0, 15)
      .map((j: any): JobItem => ({
        id: `rok-${j.id || j.slug}`,
        title: j.position,
        company: j.company,
        location: j.location || 'Remote',
        url: j.url,
        type: 'Full-time',
        postedAt: j.date,
      }));
  } catch {
    return [];
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(): Promise<NextResponse> {
  const [remotive, jobicy, remoteok] = await Promise.all([
    fetchRemotive(),
    fetchJobicy(),
    fetchRemoteOK(),
  ]);

  // Deduplicate by normalised title + company key
  const seen = new Set<string>();
  const all: JobItem[] = [];

  for (const job of [...remotive, ...jobicy, ...remoteok]) {
    const key = `${job.title}|${job.company}`.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key) && job.title && job.company && job.url) {
      seen.add(key);
      all.push(job);
    }
  }

  if (all.length === 0) {
    return NextResponse.json({ error: 'No jobs available' }, { status: 503 });
  }

  // Shuffle so ticker feels fresh each cache refresh
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return NextResponse.json(all.slice(0, 40), {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
  });
}
