'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Clock, Users, Star } from "lucide-react";
import { useRouter } from 'next/navigation';

interface GenAIPopupProps {
  // Currently no props needed
}

const GenAIPopup: React.FC<GenAIPopupProps> = () => {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Don't show if dismissed in the last 24 hours
    const dismissed = localStorage.getItem("genai-popup-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
    }

    // Show after 8 seconds
    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (): void => {
    setShow(false);
    localStorage.setItem("genai-popup-dismissed", Date.now().toString());
  };

  const handleExplore = (): void => {
    handleDismiss();
    router.push("/ai-program");
    window.scrollTo(0, 0);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[90vw] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header banner */}
            <div className="relative bg-gradient-to-br from-[#0a2540] to-[#1a3a5c] px-6 py-5">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={14} className="text-white" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-white/80" />
                </div>
                <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  Limited Seats Available
                </span>
              </div>
              <h3 className="text-white text-xl font-bold leading-tight">
                Gen AI & Prompt Engineering Program
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Master AI tools and land high-paying tech roles
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Highlights */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2.5 bg-[#f0effe] rounded-xl">
                  <Clock size={16} className="text-[#635bff] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-800">8 Weeks</p>
                  <p className="text-[10px] text-gray-500">Duration</p>
                </div>
                <div className="text-center p-2.5 bg-[#f0effe] rounded-xl">
                  <Users size={16} className="text-[#635bff] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-800">500+</p>
                  <p className="text-[10px] text-gray-500">Enrolled</p>
                </div>
                <div className="text-center p-2.5 bg-yellow-50 rounded-xl">
                  <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-800">4.9/5</p>
                  <p className="text-[10px] text-gray-500">Rating</p>
                </div>
              </div>

              {/* What you'll learn */}
              <ul className="space-y-2 mb-5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#635bff] flex-shrink-0" />
                  ChatGPT, Claude, Gemini & Midjourney mastery
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#635bff] flex-shrink-0" />
                  Advanced prompt engineering techniques
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#635bff] flex-shrink-0" />
                  Real-world projects & industry certificate
                </li>
              </ul>

              {/* CTA */}
              <button
                onClick={handleExplore}
                className="w-full bg-[#0a2540] hover:bg-[#0d3058] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all group"
              >
                Explore Program
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleDismiss}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-500 mt-3 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GenAIPopup;
