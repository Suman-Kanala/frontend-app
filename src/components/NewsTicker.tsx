'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, ExternalLink, RefreshCw, MapPin } from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  type: string;
}

const NewsTicker: React.FC = () => {
  const [jobs, setJobs]         = useState<JobItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError]     = useState(false);
  const [paused, setPaused]     = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/jobs', { next: { revalidate: 3600 } } as RequestInit);
      if (!res.ok) throw new Error('Failed');
      const data: JobItem[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Empty');
      setJobs(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Auto-resume after 2s on mobile (in case touch gets stuck)
  function handleTouchStart() {
    setPaused(true);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setPaused(false), 2000);
  }
  function handleTouchEnd() {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setPaused(false), 800);
  }

  /* ── Loading skeleton ─────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-5 py-4 flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0 bg-[#0a2540] rounded-xl px-3 py-2">
          <span className="w-1.5 h-1.5 bg-[#635bff] rounded-full animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-[0.12em]">Live Jobs</span>
        </div>
        <div className="h-3 flex-1 bg-[#E6EBF1] dark:bg-white/[0.06] rounded animate-pulse" />
        <div className="h-3 w-24 bg-[#E6EBF1] dark:bg-white/[0.06] rounded animate-pulse flex-shrink-0" />
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────────────────── */
  if (isError || jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#0a2540] rounded-xl px-3 py-2 flex-shrink-0">
          <Briefcase size={12} className="text-[#635bff]" />
          <span className="text-xs font-bold text-white uppercase tracking-[0.12em]">Live Jobs</span>
        </div>
        <span className="text-xs text-[#697386] dark:text-[#8898aa] flex-1">Unable to load live jobs.</span>
        <button
          onClick={load}
          className="text-xs text-[#635bff] flex items-center gap-1 font-semibold flex-shrink-0 hover:text-[#4f46e5] transition-colors"
        >
          <RefreshCw size={11} /> Retry
        </button>
      </div>
    );
  }

  /* ── Double the items for seamless loop ───────────────────────────────── */
  const tickerItems = [...jobs, ...jobs];

  return (
    <div
      className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl flex items-stretch overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setPaused(false)}
    >
      {/* ── Label pill ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3.5 bg-[#0a2540] flex-shrink-0">
        <span className="w-1.5 h-1.5 bg-[#635bff] rounded-full animate-pulse flex-shrink-0" />
        <span className="text-xs font-bold text-white uppercase tracking-[0.12em] whitespace-nowrap">
          Live Jobs
        </span>
      </div>

      {/* ── Scrolling strip ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden relative min-w-0">

        {/* Fade edges — light */}
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none dark:hidden"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none dark:hidden"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />
        {/* Fade edges — dark */}
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none hidden dark:block"
          style={{ background: 'linear-gradient(to right, #0d1f33, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none hidden dark:block"
          style={{ background: 'linear-gradient(to left, #0d1f33, transparent)' }} />

        <div
          className={`flex items-center h-full scroll-animation ${paused ? 'marquee-paused' : ''}`}
        >
          {tickerItems.map((job, i) => (
            <a
              key={`${job.id}-${i}`}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0 group border-r border-[#E6EBF1] dark:border-white/[0.05] last:border-0"
            >
              {/* Job type badge */}
              <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#635bff]/10 text-[#635bff] whitespace-nowrap flex-shrink-0">
                {job.type}
              </span>

              {/* Title */}
              <span className="text-xs font-semibold text-[#0a2540] dark:text-white group-hover:text-[#635bff] transition-colors whitespace-nowrap max-w-[160px] sm:max-w-[200px] truncate">
                {job.title}
              </span>

              {/* Separator */}
              <span className="w-1 h-1 rounded-full bg-[#635bff]/30 flex-shrink-0" />

              {/* Company */}
              <span className="text-xs text-[#425466] dark:text-[#8898aa] whitespace-nowrap flex-shrink-0 font-medium">
                {job.company}
              </span>

              {/* Location — hidden on very small screens */}
              {job.location && (
                <>
                  <MapPin size={10} className="text-[#697386] dark:text-white/20 flex-shrink-0 hidden sm:block" />
                  <span className="text-[11px] text-[#697386] dark:text-[#8898aa] whitespace-nowrap flex-shrink-0 max-w-[100px] truncate hidden sm:block">
                    {job.location}
                  </span>
                </>
              )}

              <ExternalLink
                size={10}
                className="text-[#E6EBF1] dark:text-white/20 group-hover:text-[#635bff]/60 flex-shrink-0 transition-colors ml-0.5"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
