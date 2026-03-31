'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

interface StickyCourseCTAProps {
  // Currently no props needed
}

const StickyCourseCTA: React.FC<StickyCourseCTAProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = (): void => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl px-5 py-3.5 shadow-2xl border border-white/10 dark:border-gray-200">
        <div className="flex items-center gap-3 min-w-0">
          <Sparkles className="h-4 w-4 text-purple-400 dark:text-purple-600 flex-shrink-0" />
          <p className="text-sm font-medium truncate">
            Not sure where to start?{' '}
            <span className="text-blue-300 dark:text-blue-600 hidden sm:inline">
              Our Gen AI Program has placement support.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/ai-program"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Learn More
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-700 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCourseCTA;
