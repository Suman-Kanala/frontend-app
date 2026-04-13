'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

const Hero: React.FC = () => {
  const handleGetStarted = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#060e1d]"
      suppressHydrationWarning
    >
      {/* Aurora gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="hero-orb-1 absolute -top-48 -left-48 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, rgba(99,91,255,0.13) 0%, transparent 65%)' }}
        />
        <div
          className="hero-orb-2 absolute -bottom-48 -right-32 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle at 60% 60%, rgba(0,212,255,0.09) 0%, transparent 65%)' }}
        />
        <div
          className="hero-orb-3 absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,61,113,0.06) 0%, transparent 65%)' }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,91,255,0.18) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          opacity: 0.22,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center pt-24 pb-20">

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#f0effe] dark:bg-[#635bff]/15 text-[#635bff] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#635bff]/20">
            Trusted by 500+ companies worldwide
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-[1.03] mb-6"
        >
          Careers
          <span className="block bg-gradient-to-r from-[#635bff] via-[#7a73ff] to-[#0a2540] dark:to-[#a5a0ff] bg-clip-text text-transparent">
            Connected.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-xl text-[#425466] dark:text-[#8898aa] max-w-[520px] mx-auto mb-10 leading-relaxed"
        >
          Bridging exceptional talent with transformative opportunities across IT, Engineering, Healthcare, and Finance — globally.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-14"
        >
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2.5 bg-[#635bff] hover:bg-[#4f46e5] text-white px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-[#635bff]/25 hover:shadow-[#635bff]/40 hover:-translate-y-0.5 transition-all duration-200 group"
          >
            Get Started Free
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2.5 bg-white dark:bg-white/5 hover:bg-[#F6F9FC] dark:hover:bg-white/10 text-[#0a2540] dark:text-white px-8 py-3.5 rounded-full text-base font-semibold border border-[#E6EBF1] dark:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Users size={17} className="text-[#635bff]" />
            How it works
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-0 divide-x divide-[#E6EBF1] dark:divide-white/[0.08]"
        >
          {[
            { number: "3,200+", label: "Jobs Placed" },
            { number: "500+",   label: "Companies" },
            { number: "6",      label: "Global Regions" },
            { number: "97%",    label: "Success Rate" },
          ].map((stat, i) => (
            <div key={i} className="text-center px-7 py-2">
              <div className="text-2xl md:text-3xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">
                {stat.number}
              </div>
              <div className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Section fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none dark:hidden"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none hidden dark:block"
        style={{ background: 'linear-gradient(to bottom, transparent, #07101d)' }} />
    </section>
  );
};

export default Hero;
