'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const stats = [
  { value: '3,200+', label: 'Placements' },
  { value: '97%',    label: 'Satisfaction' },
  { value: '6',      label: 'Global Regions' },
  { value: '< 30d',  label: 'Avg. Time-to-Hire' },
];

const values = [
  {
    num: '01',
    title: 'Precision over volume',
    body: 'We send 3–5 pre-vetted candidates per role — never a resume dump. Quality beats quantity every time.',
  },
  {
    num: '02',
    title: 'Human advocates, not algorithms',
    body: 'Every candidate has a real consultant in their corner, from first call to signed offer.',
  },
  {
    num: '03',
    title: 'Radical transparency',
    body: 'You always know where you stand. No ghosting, no vague timelines, no surprises.',
  },
  {
    num: '04',
    title: 'We stand behind placements',
    body: 'If a role doesn\'t work out in 90 days, we go back to work — at no extra cost to you.',
  },
];

const About: React.FC = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section id="about" className="bg-[#F6F9FC] dark:bg-[#060e1d] overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 1 — Full-bleed split: text left, photo right
      ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-0" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-center">

          {/* LEFT — editorial text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="py-8 lg:py-20 pr-0 lg:pr-4"
          >
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.18em] mb-6 block">
              About Saanvi Careers
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-[1.06] mb-8">
              We fix what's<br />
              broken in<br />
              <span className="bg-gradient-to-r from-[#635bff] to-[#0a2540] dark:to-[#a5a0ff] bg-clip-text text-transparent">
                recruiting.
              </span>
            </h2>

            <p className="text-[#425466] dark:text-[#8898aa] text-lg leading-relaxed mb-10 max-w-md">
              Saanvi Careers was built because the old way wasn't working — slow processes, bad matches, zero transparency. We built a firm where the candidate and the employer both win.
            </p>

            {/* Stats — minimal inline row */}
            <div className="flex flex-wrap gap-x-8 gap-y-5 mb-12">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + 0.07 * i }}
                >
                  <div className="text-2xl font-extrabold text-[#0a2540] dark:text-white tracking-tight leading-none">
                    {s.value}
                  </div>
                  <div className="text-xs text-[#697386] dark:text-[#8898aa] mt-1 font-medium uppercase tracking-wide">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-[#0a2540] hover:bg-[#0d2d4d] dark:bg-white dark:hover:bg-white/90 text-white dark:text-[#0a2540] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 group"
            >
              Work with us
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* RIGHT — tall photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden h-[380px] lg:h-[640px]"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=80"
              alt="Saanvi Careers team"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/75 via-transparent to-transparent" />

            {/* Floating caption card */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 dark:bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-2xl p-5">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.18em] mb-1">
                  Founded in India
                </p>
                <p className="text-white text-base font-bold leading-snug tracking-tight">
                  Placing talent across 6 global<br />regions since day one.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 2 — Full-width dark mission statement
      ════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-[#0a2540] mt-20 py-20 px-6 overflow-hidden"
      >
        {/* Orbs */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.18) 0%, transparent 65%)' }} />
        <div className="absolute -left-24 top-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[#635bff] text-xs font-bold uppercase tracking-[0.18em] mb-6">
            Our Mission
          </p>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.12] tracking-tight">
            "Every professional deserves a career<br className="hidden md:block" />
            that matches their potential."
          </blockquote>
          <p className="text-white/35 text-sm mt-8 font-medium">
            — The Saanvi Careers Team
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          BLOCK 3 — Numbered principles, editorial list
      ════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-14"
        >
          <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.18em] mb-4 block">
            How we work
          </span>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0a2540] dark:text-white">
            The principles behind<br className="hidden sm:block" /> everything we do.
          </h3>
        </motion.div>

        <div className="divide-y divide-[#E6EBF1] dark:divide-white/[0.07]">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + 0.1 * i }}
              className="grid md:grid-cols-[120px_1fr_2fr] gap-4 md:gap-10 py-8 group cursor-default"
            >
              {/* Number */}
              <span className="text-4xl font-extrabold text-[#E6EBF1] dark:text-white/10 leading-none group-hover:text-[#635bff]/20 transition-colors duration-300 select-none tabular-nums">
                {v.num}
              </span>

              {/* Title */}
              <h4 className="text-base font-bold text-[#0a2540] dark:text-white tracking-tight self-center">
                {v.title}
              </h4>

              {/* Body */}
              <p className="text-[#697386] dark:text-[#8898aa] text-sm leading-relaxed self-center">
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default About;
