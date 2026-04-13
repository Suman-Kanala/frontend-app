'use client';

import { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Logo from '@/components/Logo';

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#0d1f33] text-[#0a2540] dark:text-white text-sm placeholder-[#697386] dark:placeholder-white/30 outline-none transition-all duration-150 ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-[#E6EBF1] dark:border-white/10 focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/15'
  }`;

export default function SignInPage() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [step, setStep]         = useState<'email' | 'password'>('email');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOAuth] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => { setError(''); }, [email, password]);

  function handleEmailContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setStep('password');
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const createResult = await signIn.create({ identifier: email });
      if (createResult.error) {
        setError(createResult.error.longMessage ?? createResult.error.message ?? 'Sign in failed.');
        return;
      }
      const pwResult = await signIn.password({ password });
      if (pwResult.error) {
        setError(pwResult.error.longMessage ?? pwResult.error.message ?? 'Incorrect password.');
        return;
      }
      if (signIn.status === 'complete') {
        await signIn.finalize();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!signIn) return;
    setOAuth(true);
    try {
      await signIn.sso({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectCallbackUrl: `${window.location.origin}/dashboard`,
      });
    } catch {
      setOAuth(false);
      setError('Google sign-in failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="default" />
        </div>

        <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.08] rounded-2xl shadow-sm shadow-black/5 px-8 py-8">

          {/* Header */}
          <div className="mb-7">
            {step === 'password' && (
              <button
                onClick={() => { setStep('email'); setError(''); setPassword(''); }}
                className="flex items-center gap-1.5 text-xs text-[#697386] dark:text-[#8898aa] hover:text-[#425466] dark:hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={13} /> Back
              </button>
            )}
            <h1 className="text-xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">
              {step === 'email' ? 'Sign in to Saanvi Careers' : 'Enter your password'}
            </h1>
            {step === 'email' && (
              <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-1">Welcome back. Sign in to continue.</p>
            )}
            {step === 'password' && (
              <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-1 break-all">{email}</p>
            )}
          </div>

          {/* Google — first step only */}
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div
                key="oauth"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <button
                  onClick={handleGoogle}
                  disabled={oauthLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#E6EBF1] dark:border-white/10 rounded-xl bg-white dark:bg-white/5 hover:bg-[#F6F9FC] dark:hover:bg-white/10 text-sm font-semibold text-[#0a2540] dark:text-white transition-all duration-150 disabled:opacity-60"
                >
                  {oauthLoading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <GoogleIcon />}
                  Continue with Google
                </button>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#E6EBF1] dark:bg-white/[0.07]" />
                  <span className="text-xs text-[#697386] dark:text-[#8898aa] font-medium">or</span>
                  <div className="flex-1 h-px bg-[#E6EBF1] dark:bg-white/[0.07]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email step */}
          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">Email address</label>
                <input
                  type="email" autoFocus autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputCls(!!error)}
                />
              </div>
              {error && <ErrorBanner>{error}</ErrorBanner>}
              <button type="submit" className="w-full py-3 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#635bff]/20">
                Continue
              </button>
            </form>
          )}

          {/* Password step */}
          {step === 'password' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#425466] dark:text-[#8898aa]">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#635bff] hover:text-[#4f46e5] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} autoFocus autoComplete="current-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={`${inputCls(!!error)} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#425466] dark:hover:text-white transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <ErrorBanner>{error}</ErrorBanner>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#635bff]/20 flex items-center justify-center gap-2">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[#697386] dark:text-[#8898aa] mt-6">
          New to Saanvi Careers?{' '}
          <Link href="/sign-up" className="text-[#635bff] font-semibold hover:text-[#4f46e5] transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
      <AlertCircle size={13} className="flex-shrink-0" /> {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
