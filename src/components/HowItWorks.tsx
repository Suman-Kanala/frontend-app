'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Search, MessageSquare, Briefcase,
  Building2, Users, CheckCircle, ArrowRight,
  LucideIcon, Zap,
} from 'lucide-react';

interface WorkStep {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

const jobSeekerSteps: WorkStep[] = [
  {
    icon: UserPlus,
    title: 'Share Your Profile',
    description: 'Tell us your skills, experience level, and the kind of role you\'re looking for.',
    detail: 'A consultant reviews your background within 24 hours and creates a tailored placement plan — no generic job boards.',
  },
  {
    icon: Search,
    title: 'Get Matched',
    description: 'We search our verified employer network to find roles that genuinely fit your goals.',
    detail: 'Our matching goes beyond keywords — we consider company culture, growth trajectory, and compensation expectations.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coaching',
    description: 'Role-specific mock interviews, answer frameworks, and live feedback sessions.',
    detail: 'You\'ll enter every interview confident, prepared, and knowing exactly what to expect.',
  },
  {
    icon: Briefcase,
    title: 'Land Your Role',
    description: 'From offer letter to onboarding — we\'re with you every step of the way.',
    detail: '90-day placement guarantee. If it doesn\'t work out, we go back to work at no extra cost.',
  },
];

const employerSteps: WorkStep[] = [
  {
    icon: Building2,
    title: 'Define Your Needs',
    description: 'Share your requirements, team culture, and the ideal candidate profile.',
    detail: 'We invest time upfront to deeply understand your company — so every candidate we send is worth your time.',
  },
  {
    icon: Users,
    title: 'We Pre-screen',
    description: 'We source, assess, and shortlist only the best-fit candidates for your role.',
    detail: 'No resume dumps. Typically 3–5 pre-vetted candidates per role, each with a detailed consultant brief.',
  },
  {
    icon: MessageSquare,
    title: 'Streamlined Interviews',
    description: 'We coordinate scheduling, prep candidates, and support structured evaluation.',
    detail: 'Expect faster time-to-interview, better-prepared candidates, and less back-and-forth for your team.',
  },
  {
    icon: CheckCircle,
    title: 'Successful Hire',
    description: 'Onboard your new team member backed by our placement guarantee.',
    detail: 'We remain engaged post-hire to ensure a smooth start — protecting your investment in the new hire.',
  },
];

type Tab = 'seeker' | 'employer';

const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState<Tab>('seeker');
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = activeTab === 'seeker' ? jobSeekerSteps : employerSteps;
  const accentColor = activeTab === 'seeker' ? '#635bff' : '#0a2540';

  return (
    <section id="how-it-works" className="py-24 bg-[#F6F9FC] dark:bg-[#060e1d]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── HEADER ──────────────────────────────────────── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-4 block">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white mb-5 leading-tight">
            How it works.
          </h2>
          <p className="text-[#425466] dark:text-[#8898aa] text-lg leading-relaxed">
            A four-step process engineered for speed and precision — from first contact to signed offer.
          </p>
        </motion.div>

        {/* ── TAB SWITCHER ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-full p-1 shadow-sm">
            {([
              { key: 'seeker',   label: 'For Job Seekers' },
              { key: 'employer', label: 'For Employers' },
            ] as { key: Tab; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setActiveStep(0); }}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#0a2540] text-white shadow-sm'
                    : 'text-[#697386] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── MAIN LAYOUT: Steps + Detail Panel ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid lg:grid-cols-5 gap-5 items-stretch"
        >

          {/* LEFT: Step list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 h-full"
              >
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`flex items-start gap-4 rounded-2xl p-5 text-left transition-all duration-200 border ${
                      activeStep === i
                        ? 'bg-white dark:bg-[#0d1f33] border-[#635bff]/30 shadow-md shadow-[#635bff]/5'
                        : 'bg-white/60 dark:bg-[#0d1f33]/60 border-[#E6EBF1] dark:border-white/[0.07] hover:bg-white dark:hover:bg-[#0d1f33] hover:border-[#E6EBF1]'
                    }`}
                  >
                    {/* Step number */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm transition-colors duration-200 ${
                      activeStep === i
                        ? 'bg-[#635bff] text-white'
                        : 'bg-[#0a2540]/[0.06] dark:bg-white/[0.06] text-[#697386] dark:text-[#8898aa]'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold mb-0.5 transition-colors duration-200 ${
                        activeStep === i
                          ? 'text-[#0a2540] dark:text-white'
                          : 'text-[#425466] dark:text-[#8898aa]'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#697386] dark:text-[#8898aa] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    {activeStep === i && (
                      <ArrowRight size={14} className="text-[#635bff] flex-shrink-0 mt-2" />
                    )}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeStep}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="h-full bg-[#0a2540] rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Background orb */}
                <div
                  className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.2) 0%, transparent 70%)' }}
                />
                <div
                  className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }}
                />

                <div className="relative z-10">
                  {/* Step badge */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#635bff] rounded-xl flex items-center justify-center">
                      {React.createElement(steps[activeStep].icon, { size: 22, className: 'text-white' })}
                    </div>
                    <div>
                      <span className="text-[#635bff] text-xs font-bold uppercase tracking-[0.15em]">
                        Step {String(activeStep + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-white text-lg font-bold tracking-tight">
                        {steps[activeStep].title}
                      </h3>
                    </div>
                  </div>

                  {/* Main description */}
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    {steps[activeStep].description}
                  </p>

                  {/* Detail callout */}
                  <div className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-4 mb-8">
                    <p className="text-white/55 text-sm leading-relaxed">
                      {steps[activeStep].detail}
                    </p>
                  </div>
                </div>

                {/* Progress + nav */}
                <div className="relative z-10 flex items-center justify-between">
                  {/* Dot indicators */}
                  <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeStep
                            ? 'w-6 h-1.5 bg-[#635bff]'
                            : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Step ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next button */}
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStep((s) => s + 1)}
                      className="flex items-center gap-2 bg-white/[0.08] hover:bg-[#635bff] border border-white/10 hover:border-[#635bff] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                    >
                      Next step <ArrowRight size={13} />
                    </button>
                  ) : (
                    <a
                      href="#contact"
                      onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                    >
                      Get started <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── TRUST STRIP ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Zap,          stat: '< 30 days', label: 'Average placement time' },
            { icon: CheckCircle,  stat: '90-day',    label: 'Placement guarantee' },
            { icon: Users,        stat: '3,200+',    label: 'Successful placements' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-6 py-5"
            >
              <div className="w-10 h-10 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon size={18} className="text-[#635bff]" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-[#0a2540] dark:text-white tracking-tight">{item.stat}</div>
                <div className="text-xs text-[#697386] dark:text-[#8898aa] font-medium">{item.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
