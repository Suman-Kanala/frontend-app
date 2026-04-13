'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma',  role: 'Senior Software Engineer', company: 'Google India',       rating: 5, text: 'Saanvi Careers transformed my job search. Role-specific coaching — not generic tips — made a real difference. Placed within 3 weeks.', avatar: '635bff' },
  { name: 'Rajesh Kumar',  role: 'Data Science Manager',     company: 'Amazon',             rating: 4, text: "They understood the Indian tech market and connected me with opportunities I wouldn't have found on my own. The outcome was exceptional.", avatar: '0a2540' },
  { name: 'Arjun Patel',   role: 'Investment Banking VP',    company: 'Goldman Sachs',      rating: 5, text: 'They actually listened. Sent 4 pre-vetted roles — all relevant, all realistic. Ended up at Goldman after two rounds. Zero time wasted.', avatar: 'f59e0b' },
  { name: 'Anita Desai',   role: 'Consulting Director',      company: 'McKinsey & Company', rating: 5, text: 'The coaching was worth every minute. My consultant had interviewed at McKinsey-tier firms himself — the advice was anything but theoretical.', avatar: '10b981' },
  { name: 'Vikram Reddy',  role: 'Full Stack Developer',     company: 'Flipkart',           rating: 4, text: 'As a fresh grad I had no idea how to navigate the market. They fixed my resume, prepped me for technical rounds, and helped negotiate my first offer.', avatar: 'e84393' },
  { name: 'Sneha Iyer',    role: 'Cloud Architect',          company: 'TCS',                rating: 5, text: 'Mid-level backend to senior cloud architect in under 6 weeks. They knew exactly which unit was hiring and what the panel looked for.', avatar: '3b82f6' },
];

const companyLogos = [
  { name: 'TCS',           src: '/logos/tcs.svg'          },
  { name: 'Infosys',       src: '/logos/infosys.svg'      },
  { name: 'Wipro',         src: '/logos/wipro.svg'        },
  { name: 'HCLTech',       src: '/logos/hcltech.svg'      },
  { name: 'Google',        src: '/logos/google.svg'       },
  { name: 'Microsoft',     src: '/logos/microsoft.png'    },
  { name: 'Amazon',        src: '/logos/amazon.png'       },
  { name: 'Flipkart',      src: '/logos/flipkart.png'     },
  { name: 'Goldman Sachs', src: '/logos/goldmansachs.svg' },
  { name: 'Deloitte',      src: '/logos/deloitte.png'     },
  { name: 'Accenture',     src: '/logos/accenture.svg'    },
  { name: 'IBM',           src: '/logos/ibm.png'          },
  { name: 'Meta',          src: '/logos/meta.svg'         },
  { name: 'Razorpay',      src: '/logos/razorpay.svg'     },
  { name: 'Zoho',          src: '/logos/zoho.svg'         },
  { name: 'Zomato',        src: '/logos/zomato.svg'       },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < n ? 'text-amber-400 fill-amber-400' : 'text-[#E6EBF1] dark:text-white/10'} />
      ))}
    </div>
  );
}

function Card({ t }: { t: typeof testimonials[number] }) {
  return (
    <div className="w-[315px] flex-shrink-0 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <Stars n={t.rating} />
        <Quote size={14} className="text-[#E6EBF1] dark:text-white/10" />
      </div>
      <p className="text-sm text-[#425466] dark:text-[#8898aa] leading-relaxed flex-1">
        "{t.text}"
      </p>
      <div className="flex items-center gap-2.5 pt-3 border-t border-[#E6EBF1] dark:border-white/[0.06]">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.avatar}&color=ffffff&size=64`}
          alt={t.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#0a2540] dark:text-white truncate">{t.name}</p>
          <p className="text-[10px] text-[#697386] truncate">{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3);

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.1 });
  const [paused, setPaused] = useState(false);

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-[#07101d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">
              Client Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-tight">
              Trusted by professionals<br className="hidden sm:block" /> worldwide.
            </h2>
          </div>
          <div className="flex items-center gap-6">
            {[
              { v: '4.9', s: '/5',  l: 'Avg rating'  },
              { v: '3,200', s: '+', l: 'Placements'   },
              { v: '97',  s: '%',   l: 'Recommend us' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-10 bg-[#E6EBF1] dark:bg-white/10" />}
                <div>
                  <p className="text-2xl font-extrabold text-[#0a2540] dark:text-white leading-none">
                    {item.v}<span className="text-[#635bff]">{item.s}</span>
                  </p>
                  <p className="text-[11px] text-[#697386] mt-1">{item.l}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── DUAL MARQUEE — full bleed ──────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <div className={`flex gap-4 marquee-left${paused ? ' marquee-paused' : ''}`} style={{ width: 'max-content' }}>
            {[...row1, ...row1, ...row1, ...row1].map((t, i) => <Card key={i} t={t} />)}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className={`flex gap-4 marquee-right${paused ? ' marquee-paused' : ''}`} style={{ width: 'max-content' }}>
            {[...row2, ...row2, ...row2, ...row2].map((t, i) => <Card key={i} t={t} />)}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6">

        {/* ── STATS BAR ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 bg-[#0a2540] rounded-2xl px-8 py-10"
        >
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { value: '4.9 / 5', label: 'Average Client Rating'   },
              { value: '97%',     label: 'Would Recommend Us'      },
              { value: '3,200+',  label: 'Successful Placements'   },
              { value: '48%',     label: 'Average Salary Increase' },
            ].map((s, i) => (
              <div key={i} className="py-4 sm:py-0 sm:px-6">
                <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{s.value}</p>
                <p className="text-white/40 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── LOGO MARQUEE ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12"
        >
          <p className="text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-[0.15em] text-center mb-7">
            Our candidates work at
          </p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-[#07101d] to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-[#07101d] to-transparent" />
            <div className="flex scroll-animation gap-4 items-center py-1">
              {[...companyLogos, ...companyLogos].map((co, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0 px-5 py-3 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl">
                  <img src={co.src} alt={co.name} className="h-5 w-auto object-contain" loading="lazy" />
                  <span className="text-sm font-semibold text-[#425466] dark:text-[#8898aa] whitespace-nowrap">{co.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
