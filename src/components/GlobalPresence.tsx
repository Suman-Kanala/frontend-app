'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Globe2, Users, MapPin, Clock } from 'lucide-react';

const regions = [
  {
    flag: '🇮🇳',
    name: 'India',
    subtitle: 'Headquarters',
    sectors: ['IT', 'Engineering', 'Healthcare', 'Finance'],
    stat: '1,200+',
    img: 'https://images.unsplash.com/photo-1518918249916-0a72d4f98658?w=1000&q=80&auto=format&fit=crop',
    color: '#f97316',
  },
  {
    flag: '🇺🇸',
    name: 'United States',
    subtitle: 'North America',
    sectors: ['Tech', 'Finance', 'Healthcare'],
    stat: '400+',
    img: 'https://images.unsplash.com/photo-1555503071-60fe61ffbb8d?w=1000&q=80&auto=format&fit=crop',
    color: '#3b82f6',
  },
  {
    flag: '🇬🇧',
    name: 'United Kingdom',
    subtitle: 'Europe',
    sectors: ['Finance', 'Engineering', 'IT'],
    stat: '350+',
    img: 'https://images.unsplash.com/photo-1696521006529-94e5b7dd1486?w=1000&q=80&auto=format&fit=crop',
    color: '#6366f1',
  },
  {
    flag: '🇦🇺',
    name: 'Australia',
    subtitle: 'Asia Pacific',
    sectors: ['Mining', 'Healthcare', 'IT'],
    stat: '280+',
    img: 'https://images.unsplash.com/photo-1464852848170-56339e078bd4?w=1000&q=80&auto=format&fit=crop',
    color: '#10b981',
  },
  {
    flag: '🇪🇺',
    name: 'European Union',
    subtitle: 'Continental Europe',
    sectors: ['Tech', 'Finance', 'Engineering'],
    stat: '250+',
    img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1000&q=80&auto=format&fit=crop',
    color: '#8b5cf6',
  },
  {
    flag: '🇦🇪',
    name: 'Gulf Countries',
    subtitle: 'Middle East',
    sectors: ['Oil & Gas', 'Construction', 'Finance'],
    stat: '300+',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80&auto=format&fit=crop',
    color: '#f59e0b',
  },
];

const kpis = [
  { icon: Globe2, value: '6',      label: 'Regions'    },
  { icon: Users,  value: '2,500+', label: 'Placements' },
  { icon: MapPin, value: '15+',    label: 'Countries'  },
  { icon: Clock,  value: '24/7',   label: 'Support'    },
];

const GlobalPresence: React.FC = () => {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [active, setActive] = useState(0);

  const cur = regions[active];

  return (
    <section id="global" className="py-24 bg-[#F6F9FC] dark:bg-[#07101d]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ─────────────────────────────── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">
              Global Presence
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-tight">
              Six regions,<br className="hidden sm:block" /> one mission.
            </h2>
          </div>
          <p className="text-[#425466] dark:text-[#8898aa] text-base max-w-xs md:text-right leading-relaxed">
            From Bengaluru to New York — connecting talent with opportunity everywhere.
          </p>
        </motion.div>

        {/* ── MAIN PANEL ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="flex flex-col lg:flex-row gap-4 rounded-3xl overflow-hidden bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] shadow-sm shadow-black/5"
          style={{ minHeight: 520 }}
        >
          {/* ── Left: city image ── */}
          <div className="lg:w-[56%] flex-shrink-0 relative overflow-hidden" style={{ minHeight: 320 }}>

            {/* Crossfade image */}
            <AnimatePresence mode="sync">
              <motion.img
                key={active}
                src={cur.img}
                alt={cur.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{ background: `linear-gradient(150deg, ${cur.color}28 0%, transparent 55%)` }}
            />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-3xl leading-none">{cur.flag}</span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                      style={{ background: `${cur.color}80` }}
                    >
                      {cur.subtitle}
                    </span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-white tracking-tight mb-3">
                    {cur.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cur.sectors.map((s, j) => (
                      <span
                        key={j}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90"
                        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">
                    <span className="text-white font-extrabold text-2xl mr-1">{cur.stat}</span>
                    placements
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: KPIs + country list ── */}
          <div className="flex-1 flex flex-col p-6 gap-5">

            {/* KPI 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 bg-[#F6F9FC] dark:bg-[#060e1d]/60 border border-[#E6EBF1] dark:border-white/[0.06]"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-[#635bff]/10">
                    <k.icon size={13} className="text-[#635bff]" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#0a2540] dark:text-white text-base leading-none">{k.value}</p>
                    <p className="text-[#697386] text-xs mt-0.5">{k.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E6EBF1] dark:bg-white/[0.06]" />

            {/* Country rows */}
            <div className="flex flex-col flex-1 justify-center gap-0.5">
              {regions.map((r, i) => {
                const on = active === i;
                return (
                  <button
                    key={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 outline-none group"
                    style={{
                      background: on ? `${r.color}12` : 'transparent',
                    }}
                  >
                    {/* Active left bar */}
                    {on && (
                      <motion.div
                        layoutId="bar"
                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                        style={{ background: r.color }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}

                    <span className="text-xl leading-none flex-shrink-0">{r.flag}</span>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-bold leading-none mb-1 transition-colors duration-150"
                        style={{ color: on ? '#0a2540' : '#425466' }}
                      >
                        {r.name}
                      </p>
                      <p className="text-[10.5px] text-[#697386] truncate">
                        {r.sectors.join(' · ')}
                      </p>
                    </div>

                    <span
                      className="flex-shrink-0 text-sm font-extrabold transition-colors duration-150"
                      style={{ color: on ? r.color : '#C4CAD4' }}
                    >
                      {r.stat}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default GlobalPresence;
