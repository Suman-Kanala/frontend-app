'use client';

import { useState, useEffect, useRef } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#0d1f33] text-[#0a2540] dark:text-white text-sm placeholder-[#697386] dark:placeholder-white/30 outline-none transition-all duration-150 ${
    err
      ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-[#E6EBF1] dark:border-white/10 focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/15'
  }`;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'One uppercase letter',  ok: /[A-Z]/.test(password) },
    { label: 'One number',            ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="space-y-1 mt-2">
      {checks.map(c => (
        <div key={c.label} className="flex items-center gap-1.5 text-xs">
          <CheckCircle2 size={12} className={c.ok ? 'text-emerald-500' : 'text-[#E6EBF1] dark:text-white/20'} />
          <span className={c.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#697386] dark:text-[#8898aa]'}>
            {c.label}
          </span>
        </div>
      ))}
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

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const router      = useRouter();

  const [step, setStep]         = useState<'details' | 'verify'>('details');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOAuth] = useState(false);
  const [error, setError]       = useState('');
  const otpRefs                 = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setError(''); }, [email, password, name, otp]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    setError('');
    try {
      const nameParts = name.trim().split(' ');
      const { error: createErr } = await signUp.create({
        emailAddress: email,
        password,
        firstName: nameParts[0],
        lastName:  nameParts.slice(1).join(' ') || undefined,
      });
      if (createErr) { setError(createErr.longMessage ?? createErr.message ?? 'Sign up failed.'); return; }

      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (sendErr) { setError(sendErr.longMessage ?? sendErr.message ?? 'Could not send code.'); return; }

      setStep('verify');
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return; }
    setLoading(true);
    setError('');
    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyErr) { setError(verifyErr.longMessage ?? verifyErr.message ?? 'Invalid code.'); return; }

      if (signUp.status === 'complete') {
        await signUp.finalize();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? 'Verification failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  }

  async function handleGoogle() {
    if (!signUp) return;
    setOAuth(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch {
      setOAuth(false);
      setError('Google sign-up failed. Please try again.');
    }
  }

  async function resendCode() {
    if (!signUp) return;
    await signUp.verifications.sendEmailCode();
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[400px]"
      >
        <div className="flex justify-center mb-8">
          <Logo size="default" />
        </div>

        <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.08] rounded-2xl shadow-sm shadow-black/5 px-8 py-8">

          {/* ── Details step ── */}
          {step === 'details' && (
            <>
              <div className="mb-7">
                <h1 className="text-xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">Create your account</h1>
                <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-1">Start finding your perfect role today.</p>
              </div>

              <button
                onClick={handleGoogle} disabled={oauthLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#E6EBF1] dark:border-white/10 rounded-xl bg-white dark:bg-white/5 hover:bg-[#F6F9FC] dark:hover:bg-white/10 text-sm font-semibold text-[#0a2540] dark:text-white transition-all duration-150 disabled:opacity-60 mb-5"
              >
                {oauthLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#E6EBF1] dark:bg-white/[0.07]" />
                <span className="text-xs text-[#697386] dark:text-[#8898aa] font-medium">or</span>
                <div className="flex-1 h-px bg-[#E6EBF1] dark:bg-white/[0.07]" />
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">Full name</label>
                  <input type="text" autoFocus autoComplete="name" value={name}
                    onChange={e => setName(e.target.value)} placeholder="Priya Sharma"
                    className={inputCls()} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">Email address</label>
                  <input type="email" autoComplete="email" value={email}
                    onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className={inputCls()} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} autoComplete="new-password"
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Create a strong password" className={`${inputCls()} pr-11`} required />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#425466] dark:hover:text-white transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#635bff]/20 flex items-center justify-center gap-2 mt-2">
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
                <p className="text-[10px] text-[#697386] dark:text-[#8898aa] text-center leading-relaxed">
                  By creating an account you agree to our{' '}
                  <a href="/terms" className="underline hover:text-[#425466]">Terms</a> and{' '}
                  <a href="/privacy" className="underline hover:text-[#425466]">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}

          {/* ── Verify step ── */}
          {step === 'verify' && (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-2xl bg-[#f0effe] dark:bg-[#635bff]/15 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#635bff" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">Check your email</h1>
                <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-1">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-[#0a2540] dark:text-white">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      autoFocus={i === 0}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-11 h-12 text-center text-lg font-bold rounded-xl border bg-white dark:bg-[#0d1f33] text-[#0a2540] dark:text-white outline-none transition-all duration-150 ${
                        digit ? 'border-[#635bff] ring-2 ring-[#635bff]/15' : 'border-[#E6EBF1] dark:border-white/10 focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/15'
                      }`}
                    />
                  ))}
                </div>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <button type="submit" disabled={loading || otp.join('').length < 6}
                  className="w-full py-3 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#635bff]/20 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? 'Verifying…' : 'Verify email'}
                </button>
                <p className="text-center text-xs text-[#697386] dark:text-[#8898aa]">
                  Didn't receive it?{' '}
                  <button type="button" onClick={resendCode} className="text-[#635bff] font-semibold hover:text-[#4f46e5] transition-colors">
                    Resend code
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#697386] dark:text-[#8898aa] mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#635bff] font-semibold hover:text-[#4f46e5] transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
