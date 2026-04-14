'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export function flagAuthToast(type: 'signin' | 'signout') {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth_toast', type);
  }
}

export default function AuthToast() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [msg, setMsg] = useState<{ title: string; description: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const [prevSignedIn, setPrevSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const current = isSignedIn ?? false;

    // Check sessionStorage flag (set before redirect)
    const flag = sessionStorage.getItem('auth_toast');
    if (flag) {
      sessionStorage.removeItem('auth_toast');
      if (flag === 'signin' && current) {
        const name = user?.firstName ?? user?.fullName?.split(' ')[0] ?? null;
        setMsg({
          title: name ? `Welcome back, ${name}!` : 'Welcome back!',
          description: 'You are now signed in to Saanvi Careers.',
        });
        setVisible(true);
        setPrevSignedIn(current);
        return;
      } else if (flag === 'signout' && !current) {
        setMsg({ title: 'Signed out', description: 'You have been signed out successfully.' });
        setVisible(true);
        setPrevSignedIn(current);
        return;
      }
    }

    // Fallback: detect transition false → true
    if (prevSignedIn === false && current === true) {
      const name = user?.firstName ?? user?.fullName?.split(' ')[0] ?? null;
      setMsg({
        title: name ? `Welcome back, ${name}!` : 'Welcome back!',
        description: 'You are now signed in to Saanvi Careers.',
      });
      setVisible(true);
    }

    setPrevSignedIn(current);
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && msg && (
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 right-6 z-[200] flex items-start gap-3 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/10 rounded-2xl shadow-[0_16px_40px_-8px_rgba(50,50,93,0.18),0_8px_20px_-8px_rgba(0,0,0,0.22)] px-4 py-3.5 max-w-[320px] w-full"
        >
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0a2540] dark:text-white leading-tight">
              {msg.title}
            </p>
            <p className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5">
              {msg.description}
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="flex-shrink-0 text-[#697386] hover:text-[#425466] dark:hover:text-white transition-colors mt-0.5"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
