'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2 } from 'lucide-react';

const CtaSection: React.FC = () => (
  <section className="py-24 bg-[#F6F9FC] dark:bg-[#060e1d]">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a2540 0%, #0d1f3c 50%, #111827 100%)',
        }}
      >
        {/* Background orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.20) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 px-8 md:px-16 py-16 md:py-20">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#635bff] bg-[#635bff]/10 border border-[#635bff]/20 px-3 py-1.5 rounded-full">
              Start Today
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-center leading-[1.08] mb-5"
          >
            Your next great<br />
            opportunity is{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(125deg, #635bff 0%, #a78bfa 100%)' }}>
              waiting.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/45 text-base md:text-lg text-center max-w-lg mx-auto mb-12 leading-relaxed"
          >
            Whether you're a job seeker or an employer, our team is ready to connect you with the right fit — fast.
          </motion.p>

          {/* Two CTA cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {/* Job Seekers */}
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-start gap-3 rounded-2xl px-6 py-5 text-left transition-all duration-200 border border-white/10 hover:border-[#635bff]/50 hover:bg-[#635bff]/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#635bff]/15 flex items-center justify-center">
                <Briefcase size={17} className="text-[#635bff]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-1">I'm looking for a job</p>
                <p className="text-white/40 text-sm leading-relaxed">Get matched with roles that fit your skills and goals.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[#635bff] text-xs font-semibold">
                Get started <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Employers */}
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-start gap-3 rounded-2xl px-6 py-5 text-left transition-all duration-200 border border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 size={17} className="text-white/70" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-1">I'm hiring talent</p>
                <p className="text-white/40 text-sm leading-relaxed">Receive pre-vetted candidates within 72 hours.</p>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-semibold group-hover:text-white/80 transition-colors">
                Talk to us <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-white/25 text-xs mt-8"
          >
            No cost to candidates · 90-day placement guarantee · 3,200+ successful placements
          </motion.p>

        </div>
      </motion.div>
    </div>
  </section>
);

export default CtaSection;
