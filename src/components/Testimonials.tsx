'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Stripe-signature box shadows ─────────────── */
const S  = '0 13px 27px -5px rgba(50,50,93,0.18), 0 8px 16px -8px rgba(0,0,0,0.22)';
const SH = '0 30px 60px -12px rgba(50,50,93,0.22), 0 18px 36px -18px rgba(0,0,0,0.28)';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Google India',
    rating: 4.8,
    text: 'Saanvi Careers transformed my job search. Role-specific coaching — not generic tips — made a real difference. Placed within 3 weeks.',
    avatar: '635bff',
  },
  {
    name: 'Vikram Reddy',
    role: 'Full Stack Developer',
    company: 'Flipkart',
    rating: 3.9,
    text: 'As a fresh grad I had no idea how to navigate the market. They fixed my resume, prepped me for technical rounds, and helped negotiate my first offer.',
    avatar: 'e84393',
  },
  {
    name: 'Anita Desai',
    role: 'Consulting Director',
    company: 'McKinsey & Co.',
    rating: 5.0,
    text: 'The coaching was worth every minute. My consultant had interviewed at McKinsey-tier firms himself — the advice was anything but theoretical.',
    avatar: '10b981',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Data Science Manager',
    company: 'Amazon',
    rating: 4.2,
    text: "They understood the Indian tech market and connected me with opportunities I wouldn't have found on my own. The outcome was exceptional.",
    avatar: '0a2540',
  },
  {
    name: 'Sneha Iyer',
    role: 'Cloud Architect',
    company: 'TCS',
    rating: 4.5,
    text: 'Mid-level backend to senior cloud architect in under 6 weeks. They knew exactly which unit was hiring and what the panel looked for.',
    avatar: '3b82f6',
  },
  {
    name: 'Arjun Patel',
    role: 'Investment Banking VP',
    company: 'Goldman Sachs',
    rating: 4.6,
    text: 'They actually listened. Sent 4 pre-vetted roles — all relevant, all realistic. Ended up at Goldman after two rounds. Zero time wasted.',
    avatar: 'f59e0b',
  },
];


/* Partial-fill SVG stars — small, understated */
function Stars({ rating, uid }: { rating: number; uid: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => {
        const fill = Math.min(1, Math.max(0, rating - (n - 1)));
        const gid  = `${uid}-${n}`;
        return (
          <svg key={n} width="11" height="11" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={gid} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
                <stop offset={`${fill * 100}%`} stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#${gid})`}
            />
          </svg>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────── */

const Testimonials: React.FC = () => {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="py-28 bg-[#F6F9FC] dark:bg-[#060e1d]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-lg">
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-4 block">
              Client Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-[1.08]">
              Trusted by professionals<br /> across every industry.
            </h2>
            <p className="mt-4 text-[#425466] dark:text-[#8898aa] text-base leading-relaxed">
              Real outcomes, real people — from first call to signed offer.
            </p>
          </div>

          {/* Stripe-style aggregate stat block */}
          <div className="flex items-end gap-10 flex-shrink-0">
            <div>
              <div className="flex items-baseline gap-1.5 leading-none mb-2">
                <span className="text-[72px] font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-none">
                  4.7
                </span>
                <span className="text-2xl font-bold text-[#697386]">/ 5</span>
              </div>
              <Stars rating={4.7} uid="hdr" />
              <p className="text-xs text-[#697386] mt-2 font-medium">
                3,200+ verified placements
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-2 pb-1">
              {[
                { stars: '5 ★', pct: 72 },
                { stars: '4 ★', pct: 16 },
                { stars: '3 ★', pct: 8  },
                { stars: '≤2 ★', pct: 4 },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-[10px] text-[#697386] w-9 text-right tabular-nums">{b.stars}</span>
                  <div className="w-32 h-1.5 rounded-full bg-[#E6EBF1] dark:bg-white/[0.07] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-amber-400"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${b.pct}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.09, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[10px] text-[#697386] tabular-nums">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 3 × 2 CARD GRID ────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.07 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-white dark:bg-[#0d1f33] rounded-2xl p-7 flex flex-col cursor-default"
              style={{ boxShadow: S }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = SH)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = S)}
            >
              {/* Rating + company pill */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className="text-[38px] font-extrabold text-[#0a2540] dark:text-white leading-none tracking-tight">
                      {t.rating.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-[#697386]">/ 5</span>
                  </div>
                  <Stars rating={t.rating} uid={`t${i}`} />
                </div>
                <span className="text-[10px] font-bold text-[#635bff] bg-[#635bff]/08 dark:bg-[#635bff]/10 border border-[#635bff]/15 px-2.5 py-1 rounded-full whitespace-nowrap ml-3 mt-1">
                  {t.company}
                </span>
              </div>

              {/* Stripe-style thin rule */}
              <div className="h-px bg-[#E6EBF1] dark:bg-white/[0.07] mb-5" />

              {/* Quote */}
              <p className="text-[15px] text-[#425466] dark:text-[#8898aa] leading-[1.68] flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Person */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#E6EBF1] dark:border-white/[0.07]">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.avatar}&color=ffffff&size=80`}
                  alt={t.name}
                  className="w-9 h-9 rounded-full flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0a2540] dark:text-white truncate">{t.name}</p>
                  <p className="text-[11px] text-[#697386] truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── STATS BAR ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ boxShadow: S }}
        >
          <div
            className="grid sm:grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10"
            style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d1f3c 50%, #111827 100%)' }}
          >
            {[
              { value: '4.7 / 5', label: 'Average Client Rating'   },
              { value: '97%',     label: 'Would Recommend Us'      },
              { value: '3,200+',  label: 'Successful Placements'   },
              { value: '48%',     label: 'Average Salary Increase' },
            ].map((s, i) => (
              <div key={i} className="px-8 py-9 text-center">
                <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{s.value}</p>
                <p className="text-white/40 text-[13px]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
