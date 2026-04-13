'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Code2, Wrench, Heart, BarChart2, GraduationCap,
  Globe, ArrowRight, Cpu, Building2, LucideIcon,
} from 'lucide-react';

interface Industry {
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  description: string;
  roles: string[];
  color: string;
  tag?: string;
}

const industries: Industry[] = [
  {
    icon: Code2,
    title: 'IT & Software',
    shortTitle: 'IT & Software',
    description: 'Full-stack developers, DevOps, data scientists, cloud architects, and tech leaders across all modern stacks.',
    roles: ['Frontend Dev', 'DevOps', 'Data Scientist', 'CTO'],
    color: '#635bff',
    tag: 'Most Active',
  },
  {
    icon: BarChart2,
    title: 'Finance',
    shortTitle: 'Finance',
    description: 'Financial analysts, investment advisors, risk managers, and fintech specialists shaping global markets.',
    roles: ['Financial Analyst', 'Risk Manager', 'CFO', 'Fintech'],
    color: '#3b82f6',
  },
  {
    icon: Heart,
    title: 'Healthcare',
    shortTitle: 'Healthcare',
    description: 'Medical professionals, nurses, healthcare administrators, and specialist consultants across public and private sectors.',
    roles: ['Nurse', 'Hospital Admin', 'Pharmacist', 'Specialist'],
    color: '#f43f5e',
  },
  {
    icon: Wrench,
    title: 'Engineering',
    shortTitle: 'Engineering',
    description: 'Mechanical, electrical, civil, and chemical engineering roles at leading industrial and construction firms.',
    roles: ['Mechanical Eng', 'Civil Eng', 'Project Mgr', 'QA Lead'],
    color: '#f59e0b',
  },
  {
    icon: GraduationCap,
    title: 'Entry Level',
    shortTitle: 'Entry Level',
    description: 'Fresh graduates and career starters finding their first opportunity with structured mentoring and guidance.',
    roles: ['Graduate Trainee', 'Intern', 'Junior Dev', 'Associate'],
    color: '#10b981',
    tag: 'High Demand',
  },
  {
    icon: Globe,
    title: 'Global Placements',
    shortTitle: 'Global',
    description: 'India, USA, UK, Australia, EU, and Gulf — we place talent where opportunity meets ambition worldwide.',
    roles: ['Relocations', 'Visa Support', 'Cross-border', 'Expat Roles'],
    color: '#8b5cf6',
  },
];

/* ── Orbital geometry ─────────────────────────── */
const ORBIT_R = 215;
const C       = 580;          // container px
const NODE    = 94;            // node circle diameter px

function getPos(i: number) {
  const angle = (i * 60 - 90) * (Math.PI / 180);
  const cx    = C / 2;
  return {
    left: cx + ORBIT_R * Math.cos(angle) - NODE / 2,
    top:  cx + ORBIT_R * Math.sin(angle) - NODE / 2,
    spokeX: cx + ORBIT_R * Math.cos(angle),
    spokeY: cx + ORBIT_R * Math.sin(angle),
  };
}

/* ──────────────────────────────────────────────── */

const Industries: React.FC = () => {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [active, setActive] = useState<number | null>(null);

  const activeInd = active !== null ? industries[active] : null;

  return (
    <section id="industries" className="py-24 bg-white dark:bg-[#07101d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ───────────────────────────────── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-4 block">
            Industries We Serve
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-tight mb-4">
            Every sector,{' '}
            <span className="text-[#635bff]">every level.</span>
          </h2>
          <p className="text-[#425466] dark:text-[#8898aa] text-base max-w-md mx-auto">
            From cutting-edge tech to essential healthcare — connecting exceptional talent across the sectors that power the global economy.
          </p>
        </motion.div>

        {/* ── ORBITAL — desktop ─────────────────────── */}
        <div className="hidden md:flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="relative select-none"
            style={{ width: C, height: C }}
          >
            {/* ── SVG rings + spokes ── */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${C} ${C}`}
            >
              {/* Outermost faint dashed ring */}
              <circle
                cx={C / 2} cy={C / 2} r={ORBIT_R + 52}
                fill="none"
                stroke="#635bff" strokeWidth="0.6" strokeOpacity="0.10"
                strokeDasharray="5 12"
              />

              {/* Main orbit ring */}
              <circle
                cx={C / 2} cy={C / 2} r={ORBIT_R}
                fill="none"
                stroke="#635bff" strokeWidth="1" strokeOpacity="0.18"
              />

              {/* Mid decorative ring */}
              <circle
                cx={C / 2} cy={C / 2} r={ORBIT_R - 48}
                fill="none"
                stroke="#635bff" strokeWidth="0.5" strokeOpacity="0.08"
                strokeDasharray="3 8"
              />

              {/* Inner hub ring */}
              <circle
                cx={C / 2} cy={C / 2} r={88}
                fill="none"
                stroke="#635bff" strokeWidth="0.8" strokeOpacity="0.14"
              />

              {/* Spokes */}
              {industries.map((ind, i) => {
                const { spokeX, spokeY } = getPos(i);
                const on = active === i;
                return (
                  <line key={i}
                    x1={C / 2} y1={C / 2}
                    x2={spokeX} y2={spokeY}
                    stroke={on ? ind.color : '#635bff'}
                    strokeWidth={on ? 1.5 : 0.7}
                    strokeOpacity={on ? 0.7 : 0.18}
                    strokeDasharray={on ? '0' : '4 6'}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })}

              {/* Orbit-ring tick marks at each node position */}
              {industries.map((ind, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const cx = C / 2;
                const r1 = ORBIT_R - 6, r2 = ORBIT_R + 6;
                return (
                  <line key={`tick-${i}`}
                    x1={cx + r1 * Math.cos(angle)} y1={cx + r1 * Math.sin(angle)}
                    x2={cx + r2 * Math.cos(angle)} y2={cx + r2 * Math.sin(angle)}
                    stroke={active === i ? ind.color : '#635bff'}
                    strokeWidth={active === i ? 2 : 1}
                    strokeOpacity={active === i ? 0.8 : 0.3}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })}

              {/* Glow halo behind active node */}
              {active !== null && (() => {
                const ind = industries[active];
                const { spokeX, spokeY } = getPos(active);
                return (
                  <circle
                    cx={spokeX} cy={spokeY} r={54}
                    fill={ind.color} fillOpacity="0.09"
                    stroke={ind.color} strokeWidth="1" strokeOpacity="0.25"
                  />
                );
              })()}
            </svg>

            {/* ── Center hub ── */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
              <div
                className="w-[168px] h-[168px] rounded-full flex flex-col items-center justify-center text-center transition-all duration-400 relative overflow-hidden"
                style={{
                  background: activeInd
                    ? `radial-gradient(circle at 40% 40%, ${activeInd.color}1a 0%, ${activeInd.color}06 100%)`
                    : 'radial-gradient(circle at 40% 40%, rgba(99,91,255,0.10) 0%, rgba(99,91,255,0.02) 100%)',
                  border: `1.5px solid ${activeInd ? activeInd.color + '50' : 'rgba(99,91,255,0.22)'}`,
                  boxShadow: activeInd
                    ? `0 0 50px ${activeInd.color}22, inset 0 0 20px ${activeInd.color}0a`
                    : '0 0 30px rgba(99,91,255,0.08)',
                }}
              >
                <AnimatePresence mode="wait">
                  {activeInd ? (
                    <motion.div
                      key={`hub-${active}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.22 }}
                      className="px-4 flex flex-col items-center gap-1"
                    >
                      {activeInd.tag && (
                        <span
                          className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: `${activeInd.color}20`, color: activeInd.color }}
                        >
                          {activeInd.tag}
                        </span>
                      )}
                      <p className="text-sm font-extrabold text-[#0a2540] dark:text-white leading-tight mt-0.5">
                        {activeInd.title}
                      </p>
                      <p className="text-[10px] text-[#697386] dark:text-[#8898aa]">
                        {activeInd.roles.length} role types
                      </p>
                      <div
                        className="w-5 h-0.5 rounded-full mt-1"
                        style={{ background: activeInd.color }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hub-default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-col items-center gap-2 px-3"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(99,91,255,0.12)' }}
                      >
                        <Building2 size={17} className="text-[#635bff]" />
                      </div>
                      <p className="text-xs font-extrabold text-[#0a2540] dark:text-white">6 Industries</p>
                      <p className="text-[10px] text-[#697386] dark:text-[#8898aa] leading-tight text-center">
                        Hover a sector<br />to explore
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Industry nodes ── */}
            {industries.map((ind, i) => {
              const { left, top } = getPos(i);
              const on = active === i;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * i + 0.3, type: 'spring', stiffness: 200, damping: 18 }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="absolute cursor-pointer outline-none"
                  style={{ left, top, width: NODE, height: NODE }}
                >
                  <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-white dark:bg-[#0d1f33]"
                    style={{
                      border: `2px solid ${on ? ind.color : 'rgba(99,91,255,0.18)'}`,
                      boxShadow: on
                        ? `0 10px 36px ${ind.color}35, 0 0 0 5px ${ind.color}12`
                        : '0 2px 12px rgba(10,37,64,0.08)',
                      transform: on ? 'scale(1.18)' : 'scale(1)',
                    }}
                  >
                    {/* Colored radial glow inside node when active */}
                    {on && (
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ background: `radial-gradient(circle at 40% 40%, ${ind.color}1a, transparent 70%)` }}
                      />
                    )}
                    <ind.icon
                      size={18}
                      className="relative z-10 transition-colors duration-300"
                      style={{ color: on ? ind.color : '#697386' }}
                    />
                    <span
                      className="relative z-10 text-[8.5px] font-bold text-center leading-tight px-1 transition-colors duration-300"
                      style={{ color: on ? ind.color : '#697386' }}
                    >
                      {ind.shortTitle}
                    </span>
                  </div>

                  {/* Badge */}
                  {ind.tag && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[7.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#635bff] text-white whitespace-nowrap shadow-sm">
                      {ind.tag}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── Description panel ── */}
          <div className="w-full max-w-2xl -mt-6" style={{ minHeight: 90 }}>
            <AnimatePresence mode="wait">
              {activeInd && (
                <motion.div
                  key={`panel-${active}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl px-8 py-5 border"
                  style={{
                    background: `linear-gradient(135deg, ${activeInd.color}0d 0%, transparent 60%)`,
                    borderColor: `${activeInd.color}2a`,
                  }}
                >
                  <p className="text-sm text-[#425466] dark:text-[#8898aa] mb-3 leading-relaxed">
                    {activeInd.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeInd.roles.map((r, j) => (
                      <span
                        key={j}
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: `${activeInd.color}15`, color: activeInd.color }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── MOBILE GRID ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.06 * i }}
              className="rounded-2xl p-5 border border-[#E6EBF1] dark:border-white/[0.07] bg-white dark:bg-[#0d1f33]"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
                style={{ background: `${ind.color}15`, border: `1.5px solid ${ind.color}40` }}
              >
                <ind.icon size={18} style={{ color: ind.color }} />
              </div>
              <h3 className="text-sm font-bold text-[#0a2540] dark:text-white mb-1">{ind.title}</h3>
              <p className="text-xs text-[#697386] dark:text-[#8898aa] leading-relaxed">{ind.description}</p>
              {ind.tag && (
                <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#635bff] text-white">
                  {ind.tag}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── BOTTOM STRIP ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 bg-[#F6F9FC] dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-8 py-6"
        >
          <div className="flex items-center gap-3">
            <Cpu size={17} className="text-[#635bff] flex-shrink-0" />
            <p className="text-sm text-[#425466] dark:text-[#8898aa]">
              <span className="font-semibold text-[#0a2540] dark:text-white">Don't see your industry?</span>{' '}
              We also work with Legal, Education, Logistics, and more.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-[#635bff]/20"
          >
            Get in touch <ArrowRight size={13} />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Industries;
