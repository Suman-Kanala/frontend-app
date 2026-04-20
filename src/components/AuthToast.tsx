'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, LogOut, X } from 'lucide-react';

/** Call this before programmatic sign-out (e.g. from the Header). */
export function flagAuthToast(type: 'signin' | 'signout') {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('auth_toast', type);
  }
}

type ToastMsg = {
  type: 'signin' | 'signout';
  title: string;
  description: string;
};

function AuthToastInner() {
  const { user, isLoaded, isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const [visible, setVisible] = useState(false);
  const hasFired = useRef(false);
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const current = !!isSignedIn;

    // ── One-time check on first load ──────────────────────────────
    if (!hasFired.current) {
      hasFired.current = true;

      // 1. URL param ?auth=signin  (most reliable — survives full page reload)
      const urlFlag = searchParams.get('auth') as 'signin' | 'signout' | null;

      // 2. sessionStorage flag (set by flagAuthToast() before programmatic signOut)
      const ssFlag = sessionStorage.getItem('auth_toast') as 'signin' | 'signout' | null;
      if (ssFlag) sessionStorage.removeItem('auth_toast');

      const flag = urlFlag ?? ssFlag;

      if (flag === 'signin' && current) {
        const name = user?.firstName ?? user?.fullName?.split(' ')[0] ?? null;
        show({
          type: 'signin',
          title: name ? `Welcome back, ${name}!` : 'Welcome back!',
          description: 'You are now signed in to Saanvi Careers.',
        });
        prevSignedIn.current = current;
        return;
      }

      if (flag === 'signout' && !current) {
        show({
          type: 'signout',
          title: 'Signed out',
          description: 'You have been signed out successfully.',
        });
        prevSignedIn.current = current;
        return;
      }

      // No flag — just record current state for transition detection
      prevSignedIn.current = current;
      return;
    }

    // ── Subsequent renders: detect in-session transitions ─────────
    // false → true  (e.g. SSO callback without redirect)
    if (prevSignedIn.current === false && current === true) {
      const name = user?.firstName ?? user?.fullName?.split(' ')[0] ?? null;
      show({
        type: 'signin',
        title: name ? `Welcome back, ${name}!` : 'Welcome back!',
        description: 'You are now signed in to Saanvi Careers.',
      });
    }

    // true → false  (in-session sign-out without sessionStorage flag)
    if (prevSignedIn.current === true && current === false) {
      show({
        type: 'signout',
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    }

    prevSignedIn.current = current;
  }, [isLoaded, isSignedIn, user]); // eslint-disable-line react-hooks/exhaustive-deps

  function show(m: ToastMsg) {
    setMsg(m);
    setVisible(true);
  }

  // Auto-dismiss after 4 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [visible]);

  const isSignin = msg?.type === 'signin';

  return (
    <AnimatePresence>
      {visible && msg && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed top-[68px] right-6 z-[9999] flex items-start gap-3 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(50,50,93,0.18),0_8px_20px_-8px_rgba(0,0,0,0.22)] px-4 py-3.5 max-w-[300px] w-full"
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {isSignin
              ? <CheckCircle2 size={18} className="text-emerald-500" />
              : <LogOut size={18} className="text-[#697386] dark:text-[#8898aa]" />
            }
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0a2540] dark:text-white leading-tight">
              {msg.title}
            </p>
            <p className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5">
              {msg.description}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            className="flex-shrink-0 text-[#697386] hover:text-[#425466] dark:hover:text-white transition-colors mt-0.5"
          >
            <X size={14} />
          </button>

          {/* Progress bar */}
          <motion.div
            className={`absolute bottom-0 left-0 h-[3px] ${isSignin ? 'bg-emerald-500' : 'bg-[#635bff]'}`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js App Router
import { Suspense } from 'react';

export default function AuthToast() {
  return (
    <Suspense fallback={null}>
      <AuthToastInner />
    </Suspense>
  );
}
