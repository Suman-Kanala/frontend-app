'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Search, MessageSquare, Briefcase,
  Building2, Users, CheckCircle, ArrowRight,
  Check, Zap, LucideIcon,
} from 'lucide-react';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

const seekerSteps: Step[] = [
  { icon: UserPlus,      title: 'Share Your Profile',    description: "Tell us your skills, experience level, and the kind of role you're looking for.",   detail: 'A consultant reviews your background within 24 hours and creates a tailored placement plan — no generic job boards.' },
  { icon: Search,        title: 'Get Matched',            description: 'We search our verified employer network to find roles that genuinely fit your goals.', detail: 'Our matching goes beyond keywords — we consider company culture, growth trajectory, and compensation expectations.' },
  { icon: MessageSquare, title: 'Interview Coaching',     description: 'Role-specific mock interviews, answer frameworks, and live feedback sessions.',         detail: "You'll enter every interview confident, prepared, and knowing exactly what to expect from the panel." },
  { icon: Briefcase,     title: 'Land Your Role',         description: "From offer letter to onboarding — we're with you every step of the way.",              detail: "90-day placement guarantee. If it doesn't work out, we go back to work at no extra cost." },
];

const employerSteps: Step[] = [
  { icon: Building2,     title: 'Define Your Needs',      description: 'Share your requirements, team culture, and the ideal candidate profile.',               detail: 'We invest time upfront to deeply understand your company — so every candidate we send is worth your time.' },
  { icon: Users,         title: 'We Pre-screen',           description: 'We source, assess, and shortlist only the best-fit candidates for your role.',          detail: 'No resume dumps. Typically 3–5 pre-vetted candidates per role, each with a detailed consultant brief.' },
  { icon: MessageSquare, title: 'Streamlined Interviews',  description: 'We coordinate scheduling, prep candidates, and support structured evaluation.',          detail: 'Expect faster time-to-interview, better-prepared candidates, and less back-and-forth for your team.' },
  { icon: CheckCircle,   title: 'Successful Hire',         description: 'Onboard your new team member backed by our placement guarantee.',                        detail: 'We remain engaged post-hire to ensure a smooth start — protecting your investment in the new hire.' },
];

type Tab = 'seeker' | 'employer';

/* ──────────────────────────────────────────────── */

const HowItWorks: React.FC = () => {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [tab,  setTab]  = useState<Tab>('seeker');
  const [step, setStep] = useState(0);

  const steps = tab === 'seeker' ? seekerSteps : employerSteps;
  const cur   = steps[step];

  return (
    <section id="how-it-works" className="py-24 bg-[#F6F9FC] dark:bg-[#060e1d]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ─────────────────────────────── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">Process</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-tight">
              How it works.
            </h2>
          </div>
          <p className="text-[#425466] dark:text-[#8898aa] text-base max-w-xs md:text-right leading-relaxed">
            A four-step process engineered for speed and precision — from first contact to signed offer.
          </p>
        </motion.div>

        {/* ── TAB SWITCHER ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex mb-10"
        >
          <div className="inline-flex items-center bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-full p-1 shadow-sm">
            {([
              { key: 'seeker'   as Tab, label: 'For Job Seekers' },
              { key: 'employer' as Tab, label: 'For Employers'   },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setStep(0); }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  tab === t.key
                    ? 'bg-[#0a2540] text-white shadow-sm'
                    : 'text-[#697386] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── STEP PROGRESS STRIP ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative flex items-start justify-between mb-8"
        >
          {/* Base line */}
          <div className="absolute left-5 right-5 top-5 h-px bg-[#E6EBF1] dark:bg-white/[0.08] z-0" />
          {/* Progress fill */}
          <div
            className="absolute left-5 top-5 h-px bg-[#635bff] z-0 transition-all duration-500 ease-out"
            style={{ right: `calc(${((steps.length - 1 - step) / (steps.length - 1)) * 100}% - 2px)` }}
          />

          {steps.map((s, i) => {
            const done   = i < step;
            const active = i === step;
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="relative z-10 flex flex-col items-center gap-2.5 outline-none"
                style={{ width: `${100 / steps.length}%` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border-2 transition-all duration-300"
                  style={{
                    background:  done || active ? '#635bff' : 'white',
                    borderColor: done || active ? '#635bff' : '#E6EBF1',
                    color:       done || active ? 'white'   : '#697386',
                    boxShadow:   active ? '0 0 0 4px rgba(99,91,255,0.15)' : 'none',
                  }}
                >
                  {done ? <Check size={14} /> : <span>{String(i + 1).padStart(2, '0')}</span>}
                </div>
                <span
                  className="text-xs font-semibold text-center leading-tight transition-colors duration-200 hidden sm:block"
                  style={{ color: active ? '#0a2540' : '#697386' }}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── DETAIL CARD ────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${step}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="relative bg-[#0a2540] rounded-3xl overflow-hidden"
          >
            {/* Orbs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.22) 0%, transparent 65%)' }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)' }} />

            {/* Watermark number */}
            <div
              className="absolute right-8 top-1/2 -translate-y-1/2 font-extrabold text-white select-none pointer-events-none"
              style={{ fontSize: 200, lineHeight: 1, opacity: 0.03 }}
            >
              {String(step + 1).padStart(2, '0')}
            </div>

            <div className="relative z-10 grid md:grid-cols-2">

              {/* Left: title + desc + nav */}
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <span className="text-[#635bff] text-[10px] font-bold uppercase tracking-[0.2em] block mb-6">
                    Step {String(step + 1).padStart(2, '0')} of {steps.length}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                    {cur.title}
                  </h3>
                  <p className="text-white/60 text-base leading-relaxed">{cur.description}</p>
                </div>

                <div className="flex items-center gap-3 mt-10">
                  <button
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <ArrowRight size={14} className="rotate-180" />
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      className="flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                    >
                      Next step <ArrowRight size={13} />
                    </button>
                  ) : (
                    <a
                      href="#contact"
                      onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                    >
                      Get started <ArrowRight size={13} />
                    </a>
                  )}

                  <div className="flex items-center gap-1.5 ml-1">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStep(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === step ? 20 : 6, height: 6, background: i === step ? '#635bff' : 'rgba(255,255,255,0.18)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: icon + detail callout */}
              <div
                className="p-8 md:p-12 flex flex-col justify-center"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(99,91,255,0.18)' }}
                >
                  {React.createElement(cur.icon, { size: 24, className: 'text-[#635bff]' })}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#635bff] mb-3">
                  What this means for you
                </p>
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <p className="text-white/55 text-sm leading-relaxed">{cur.detail}</p>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── TRUST STRIP ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 grid sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Zap,         stat: '< 30 days', label: 'Average placement time' },
            { icon: CheckCircle, stat: '90-day',    label: 'Placement guarantee'    },
            { icon: Users,       stat: '3,200+',    label: 'Successful placements'  },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-6 py-5">
              <div className="w-10 h-10 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon size={17} className="text-[#635bff]" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#0a2540] dark:text-white tracking-tight">{item.stat}</p>
                <p className="text-xs text-[#697386] dark:text-[#8898aa] font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
