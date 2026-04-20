'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Briefcase, Clock, Tag, X, ChevronRight,
  Upload, FileText, CheckCircle, Search, MapPin,
  Loader2, AlertCircle, Building2, ArrowLeft, Download, Eye,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
export interface MatchedJob {
  id: string; title: string; company: string; location: string;
  url: string; type: string; postedAt: string; daysAgo: number;
  matchScore: number; matchLabel: string; description?: string; source?: string;
}

/* ─── Types ──────────────────────────────────────────────────────── */
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  skills: string[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

const EXPERIENCE_OPTIONS = [
  '0–1 years (Fresher)',
  '1–3 years',
  '3–5 years',
  '5–7 years',
  '7–10 years',
  '10+ years',
];

const COUNTRIES = [
  { code: 'IN', flag: '🇮🇳', name: 'India' },
  { code: 'US', flag: '🇺🇸', name: 'USA' },
  { code: 'GB', flag: '🇬🇧', name: 'UK' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE / Gulf' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
const inputCls =
  'w-full px-3.5 py-2.5 bg-[#F6F9FC] dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl text-sm text-[#0a2540] dark:text-white placeholder-[#697386] dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all';

function MatchBadge({ score }: { score: number }) {
  const cfg =
    score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
    score >= 60 ? 'bg-[#f0effe] text-[#635bff] border-[#635bff]/20 dark:bg-[#635bff]/10 dark:text-[#a5a0ff]' :
    score >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' :
                  'bg-[#F6F9FC] text-[#697386] border-[#E6EBF1] dark:bg-white/5 dark:text-[#8898aa]';
  return (
    <span className={`inline-flex items-center font-bold text-lg px-3 py-1 rounded-xl border ${cfg}`}>
      {score}%
    </span>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = ['Profile', 'Location', 'Resume', 'Results'];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < step ? 'bg-[#635bff] text-white' :
              i === step ? 'bg-[#0a2540] dark:bg-white text-white dark:text-[#0a2540] ring-4 ring-[#635bff]/20' :
              'bg-[#E6EBF1] dark:bg-white/10 text-[#697386] dark:text-[#8898aa]'
            }`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold mt-1.5 tracking-wide ${
              i === step ? 'text-[#0a2540] dark:text-white' : 'text-[#697386] dark:text-[#8898aa]'
            }`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 sm:w-24 h-px mx-2 mb-4 transition-all duration-500 ${
              i < step ? 'bg-[#635bff]' : 'bg-[#E6EBF1] dark:bg-white/10'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ─── Page ───────────────────────────────────────────────────────── */
export default function JobFinderPage() {
  const [step, setStep]                   = useState(0);
  const [dir, setDir]                     = useState(1);
  const [profile, setProfile]             = useState<ProfileData>({
    name: '', email: '', phone: '', role: '', experience: '', skills: [], emailVerified: false, phoneVerified: false,
  });
  const [skillInput, setSkillInput]       = useState('');
  const [otpSent, setOtpSent]             = useState(false);
  const [otpInput, setOtpInput]           = useState('');
  const [sendingOtp, setSendingOtp]       = useState(false);
  const [verifyingOtp, setVerifyingOtp]   = useState(false);
  const [countries, setCountries]         = useState<string[]>([]);
  const [resumeFile, setResumeFile]       = useState<File | null>(null);
  const [dragOver, setDragOver]           = useState(false);
  const [applicationId, setAppId]         = useState('');
  const [jobs, setJobs]                   = useState<MatchedJob[]>([]);
  const [loadingJobs, setLoadingJobs]     = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [appliedJobs, setAppliedJobs]     = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId]       = useState<string | null>(null);
  const [showATSModal, setShowATSModal]   = useState(false);
  const [lastAppliedJob, setLastApplied]  = useState<MatchedJob | null>(null);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const { isAdmin }                       = useAuth();
  const [checkingEmail, setCheckingEmail] = useState(false);
  const emailCheckTimeoutRef              = useRef<NodeJS.Timeout | null>(null);

  /* ── Check if email is already verified (with debounce) ──────── */
  async function checkEmailVerification(email: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    
    try {
      setCheckingEmail(true);
      const res = await fetch(`/api/job-finder/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (data.emailVerified) {
        setProfile(p => ({ ...p, emailVerified: true }));
        setOtpSent(false);
        setOtpInput('');
        toast({ 
          title: 'Email already verified!', 
          description: 'This email was verified previously. You can continue.' 
        });
      }
    } catch (err) {
      console.error('Error checking email:', err);
    } finally {
      setCheckingEmail(false);
    }
  }

  /* ── Debounced email check (waits 1.5 seconds after user stops typing) ──────── */
  function debouncedEmailCheck(email: string) {
    // Clear any existing timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Only check if email is valid
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Set new timeout to check after 1.5 seconds
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailVerification(email);
      }, 1500);
    }
  }

  /* ── Cleanup timeout on unmount ──────── */
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  /* ── Navigation ─────────────────────────────────── */
  function goTo(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Email OTP ──────────────────────────────────── */
  async function sendOTP() {
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch('/api/job-finder/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      toast({ title: 'OTP sent!', description: 'Check your email for the verification code.' });
    } catch (err: any) {
      toast({ title: 'Failed to send OTP', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyOTP() {
    if (!otpInput.trim()) {
      toast({ title: 'Enter OTP', description: 'Please enter the 6-digit code from your email.', variant: 'destructive' });
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/job-finder/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: profile.email, otp: otpInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(p => ({ ...p, emailVerified: true }));
      toast({ title: 'Email verified!', description: 'You can now continue.' });
    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.message || 'Invalid or expired OTP.', variant: 'destructive' });
    } finally {
      setVerifyingOtp(false);
    }
  }

  /* ── Skills ─────────────────────────────────────── */
  function addSkill(raw: string) {
    const skills = raw.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);
    setProfile(p => ({
      ...p,
      skills: [...new Set([...p.skills, ...skills])].slice(0, 20),
    }));
    setSkillInput('');
  }

  function removeSkill(s: string) {
    setProfile(p => ({ ...p, skills: p.skills.filter(k => k !== s) }));
  }

  /* ── Step 1 → save profile ──────────────────────── */
  async function submitProfile() {
    if (!profile.name || !profile.email || !profile.phone || !profile.role || !profile.experience || !profile.skills.length) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields including phone and at least one skill.', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast({ title: 'Invalid email', variant: 'destructive' });
      return;
    }
    if (!profile.emailVerified) {
      toast({ title: 'Email not verified', description: 'Please verify your email with the OTP sent to your inbox.', variant: 'destructive' });
      return;
    }
    goTo(1);
  }

  /* ── Step 2 → country selection ─────────────────── */
  function toggleCountry(code: string) {
    setCountries(cs =>
      cs.includes(code) ? cs.filter(c => c !== code) : [...cs, code]
    );
  }

  async function submitCountries() {
    if (!countries.length) {
      toast({ title: 'Select at least one country', variant: 'destructive' });
      return;
    }
    // Save profile to DB
    setSubmitting(true);
    try {
      const res = await fetch('/api/job-finder/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, countries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAppId(data.applicationId);
      goTo(2);
    } catch {
      toast({ title: 'Could not save profile', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Resume handling ────────────────────────────── */
  const handleFile = useCallback((file: File) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast({ title: 'Unsupported format', description: 'Please upload a PDF or Word document.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max file size is 5 MB.', variant: 'destructive' });
      return;
    }
    setResumeFile(file);
  }, []);

  async function submitResume() {
    setSubmitting(true);
    try {
      // Upload resume if provided
      if (resumeFile && applicationId) {
        const fd = new FormData();
        fd.append('resume', resumeFile);
        fd.append('applicationId', applicationId);
        await fetch('/api/job-finder/resume', { method: 'POST', body: fd });
      }

      // Fetch matching jobs
      goTo(3);
      setLoadingJobs(true);
      const res = await fetch('/api/job-finder/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: profile.role,
          skills: profile.skills,
          experience: profile.experience,
          countries,
        }),
      });
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } catch {
      toast({ title: 'Could not fetch jobs', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
      setLoadingJobs(false);
    }
  }

  /* ── Apply ──────────────────────────────────────── */
  async function applyJob(job: MatchedJob) {
    setApplyingId(job.id);
    try {
      const res = await fetch('/api/job-finder/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, job }),
      });
      if (!res.ok) throw new Error();
      setAppliedJobs(s => new Set([...s, job.id]));
      setLastApplied(job);
      setShowATSModal(true);
    } catch {
      toast({ title: 'Failed to apply', description: 'Try WhatsApp: +91 8074172398', variant: 'destructive' });
    } finally {
      setApplyingId(null);
    }
  }

  /* ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">

        {/* Page header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.18em] mb-3 block">
            Job Finder
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white mb-4">
            Find your perfect role.
          </h1>
          <p className="text-[#425466] dark:text-[#8898aa] text-lg max-w-lg mx-auto">
            Tell us what you're looking for. We'll match you to real openings from the last 2 weeks and apply on your behalf.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* Steps */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >

            {/* ═══ STEP 0: PROFILE ══════════════════════════════ */}
            {step === 0 && (
              <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a2540] dark:text-white mb-1">Your profile</h2>
                <p className="text-sm text-[#697386] dark:text-[#8898aa] mb-8">We use this to find roles that match your background.</p>

                <div className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386]" />
                        <input
                          type="text" value={profile.name}
                          onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                          className={`${inputCls} pl-9`} placeholder="Priya Sharma"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386]" />
                        <input
                          type="email" value={profile.email}
                          onChange={e => {
                            const newEmail = e.target.value;
                            setProfile(p => ({ ...p, email: newEmail, emailVerified: false }));
                            setOtpSent(false);
                            setOtpInput('');
                            // Trigger debounced email check (waits 1.5s after user stops typing)
                            debouncedEmailCheck(newEmail.trim());
                          }}
                          disabled={profile.emailVerified}
                          className={`${inputCls} pl-9 ${profile.emailVerified ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-300 dark:border-emerald-500/30 pr-20' : ''}`}
                          placeholder="you@example.com"
                        />
                        {checkingEmail && (
                          <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#635bff] animate-spin" />
                        )}
                        {profile.emailVerified && !checkingEmail && (
                          <>
                            <CheckCircle size={16} className="absolute right-16 top-1/2 -translate-y-1/2 text-emerald-500" />
                            <button
                              onClick={() => {
                                setProfile(p => ({ ...p, emailVerified: false }));
                                setOtpSent(false);
                                setOtpInput('');
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#635bff] hover:text-[#4f46e5] transition-colors px-2 py-1"
                              type="button"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* OTP verification UI */}
                      {!profile.emailVerified && profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) && (
                        <div className="mt-3 p-3 bg-[#f0effe] dark:bg-[#635bff]/10 border border-[#635bff]/20 rounded-xl">
                          {!otpSent ? (
                            <button
                              onClick={sendOTP}
                              disabled={sendingOtp}
                              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#635bff] hover:text-[#4f46e5] transition-colors disabled:opacity-60"
                            >
                              {sendingOtp ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                              {sendingOtp ? 'Sending OTP...' : 'Send verification code'}
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-[#425466] dark:text-[#8898aa] font-medium">
                                Enter the 6-digit code sent to <span className="font-bold text-[#635bff]">{profile.email}</span>
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={otpInput}
                                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  placeholder="000000"
                                  maxLength={6}
                                  className="flex-1 px-3 py-2 bg-white dark:bg-white/5 border border-[#E6EBF1] dark:border-white/10 rounded-lg text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff]"
                                />
                                <button
                                  onClick={verifyOTP}
                                  disabled={verifyingOtp || otpInput.length !== 6}
                                  className="px-4 py-2 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                  {verifyingOtp ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
                                </button>
                              </div>
                              <button
                                onClick={sendOTP}
                                disabled={sendingOtp}
                                className="text-xs text-[#635bff] hover:text-[#4f46e5] font-medium transition-colors disabled:opacity-60"
                              >
                                Resend code
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {profile.emailVerified && (
                        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle size={12} /> Email verified successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386]" />
                      <input
                        type="tel" 
                        value={profile.phone}
                        onChange={e => {
                          // Only allow numbers, +, spaces, and hyphens
                          const value = e.target.value.replace(/[^\d+\s-]/g, '');
                          setProfile(p => ({ ...p, phone: value }));
                        }}
                        className={`${inputCls} pl-9`}
                        placeholder="+91 98765 43210"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Job Title / Role <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386]" />
                      <input
                        type="text" value={profile.role}
                        onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                        className={`${inputCls} pl-9`} placeholder="e.g. Senior React Developer"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Experience <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386] pointer-events-none" />
                      <select
                        value={profile.experience}
                        onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                        className={`${inputCls} pl-9 appearance-none cursor-pointer`}
                      >
                        <option value="">Select experience level</option>
                        {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-semibold text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Skills <span className="text-red-400">*</span>
                      <span className="text-[#697386] ml-1 font-normal">(press Enter or comma to add)</span>
                    </label>
                    {/* Tag pills */}
                    {profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {profile.skills.map(s => (
                          <span key={s} className="inline-flex items-center gap-1 text-xs font-semibold bg-[#f0effe] dark:bg-[#635bff]/10 text-[#635bff] px-2.5 py-1 rounded-full">
                            {s}
                            <button onClick={() => removeSkill(s)} className="hover:text-[#4f46e5]">
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697386]" />
                      <input
                        type="text"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            if (skillInput.trim()) addSkill(skillInput);
                          }
                        }}
                        onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
                        className={`${inputCls} pl-9`}
                        placeholder="React, TypeScript, Node.js…"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={submitProfile}
                    className="inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all shadow-sm shadow-[#635bff]/20 group"
                  >
                    Continue to Location
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 1: LOCATION ═════════════════════════════ */}
            {step === 1 && (
              <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a2540] dark:text-white mb-1">Target locations</h2>
                <p className="text-sm text-[#697386] dark:text-[#8898aa] mb-8">
                  Where do you want to work? Select all that apply.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {COUNTRIES.map(c => {
                    const selected = countries.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        onClick={() => toggleCountry(c.code)}
                        className={`flex flex-col items-center gap-2 py-5 rounded-2xl border transition-all duration-150 ${
                          selected
                            ? 'border-[#635bff] bg-[#f0effe] dark:bg-[#635bff]/10 shadow-sm'
                            : 'border-[#E6EBF1] dark:border-white/[0.07] hover:border-[#635bff]/40 hover:bg-[#F6F9FC] dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="text-3xl">{c.flag}</span>
                        <span className={`text-xs font-semibold ${selected ? 'text-[#635bff]' : 'text-[#425466] dark:text-[#8898aa]'}`}>
                          {c.name}
                        </span>
                        {selected && (
                          <CheckCircle size={14} className="text-[#635bff]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {countries.length > 0 && (
                  <p className="text-xs text-[#697386] dark:text-[#8898aa] mb-6">
                    Selected: <span className="font-semibold text-[#635bff]">
                      {countries.map(c => COUNTRIES.find(x => x.code === c)?.name).join(', ')}
                    </span>
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <button onClick={() => goTo(0)} className="inline-flex items-center gap-1.5 text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={submitCountries}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all shadow-sm shadow-[#635bff]/20 group"
                  >
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
                    Continue to Resume
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 2: RESUME ═══════════════════════════════ */}
            {step === 2 && (
              <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-3xl p-8 md:p-10 shadow-sm">
                <h2 className="text-xl font-bold text-[#0a2540] dark:text-white mb-1">Upload your resume</h2>
                <p className="text-sm text-[#697386] dark:text-[#8898aa] mb-8">
                  Your resume is shared with our team when you apply. PDF, DOC, or DOCX — max 5 MB.
                </p>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile(f);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-[#635bff] bg-[#f0effe] dark:bg-[#635bff]/10'
                      : resumeFile
                      ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                      : 'border-[#E6EBF1] dark:border-white/[0.1] hover:border-[#635bff]/50 hover:bg-[#F6F9FC] dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  {resumeFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <FileText size={26} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2540] dark:text-white text-sm">{resumeFile.name}</p>
                        <p className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5">
                          {(resumeFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <button
                          onClick={e => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <X size={11} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-xl flex items-center justify-center">
                        <Upload size={24} className="text-[#635bff]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2540] dark:text-white text-sm">
                          Drop your resume here, or click to browse
                        </p>
                        <p className="text-xs text-[#697386] dark:text-[#8898aa] mt-1">PDF, DOC, DOCX — up to 5 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skip option */}
                <p className="text-center text-xs text-[#697386] dark:text-[#8898aa] mt-4">
                  No resume yet?{' '}
                  <button
                    onClick={submitResume}
                    className="text-[#635bff] hover:underline font-medium"
                  >
                    Skip and find jobs anyway
                  </button>
                </p>

                <div className="flex items-center justify-between mt-8">
                  <button onClick={() => goTo(1)} className="inline-flex items-center gap-1.5 text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={submitResume}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all shadow-sm shadow-[#635bff]/20 group"
                  >
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                    Find Matching Jobs
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: RESULTS ══════════════════════════════ */}
            {step === 3 && (
              <div>
                {loadingJobs ? (
                  <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Search size={28} className="text-[#635bff] animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0a2540] dark:text-white mb-2">Searching trusted job portals…</h3>
                    <p className="text-sm text-[#697386] dark:text-[#8898aa]">Scanning Indeed, Reed, Naukri, Seek &amp; more for <strong className="text-[#0a2540] dark:text-white">{profile.role}</strong> across your selected countries</p>
                    <div className="flex justify-center gap-1.5 mt-6">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 bg-[#635bff]/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-3xl p-16 text-center shadow-sm">
                    <AlertCircle size={32} className="text-amber-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[#0a2540] dark:text-white mb-2">No matches found right now</h3>
                    <p className="text-sm text-[#697386] dark:text-[#8898aa] mb-6">Our team will search manually and reach out within 24 hours.</p>
                    <a
                      href={`https://wa.me/918074172398?text=${encodeURIComponent(`Hi, I'm looking for ${profile.role} roles. My details are saved.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
                    >
                      Chat on WhatsApp instead
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Results header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-[#0a2540] dark:text-white">
                          {jobs.length} matches found
                        </h2>
                        <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-0.5">
                          For <span className="font-semibold text-[#0a2540] dark:text-white">{profile.role}</span> · last 14 days · sorted by match
                        </p>
                      </div>
                      <button
                        onClick={() => goTo(2)}
                        className="text-xs text-[#635bff] hover:text-[#4f46e5] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ArrowLeft size={12} /> Refine
                      </button>
                    </div>

                    {/* Job cards */}
                    <div className="space-y-4">
                      {jobs.map((job, i) => {
                        const applied = appliedJobs.has(job.id);
                        const applying = applyingId === job.id;
                        return (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.04, 0.6) }}
                            className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {/* Title */}
                                <h3 className="font-bold text-[#0a2540] dark:text-white text-base mb-1 leading-tight">
                                  {job.title}
                                </h3>

                                {/* Meta row */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#697386] dark:text-[#8898aa] mb-3">
                                  <span className="flex items-center gap-1">
                                    <Building2 size={11} /> {job.company}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {job.location}
                                  </span>
                                  <span className="bg-[#F6F9FC] dark:bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                    {job.type}
                                  </span>
                                  <span className="text-[#E6EBF1] dark:text-white/20">·</span>
                                  <span>{job.daysAgo === 0 ? 'Today' : `${job.daysAgo}d ago`}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 flex-wrap">
                                  {applied ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                      <CheckCircle size={12} /> Applied via Saanvi
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => applyJob(job)}
                                      disabled={applying}
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white px-4 py-2 rounded-full transition-colors"
                                    >
                                      {applying
                                        ? <><Loader2 size={11} className="animate-spin" /> Applying…</>
                                        : 'Apply via Saanvi Careers'}
                                    </button>
                                  )}
                                  {job.source && (
                                    <span className="text-[10px] text-[#697386] dark:text-[#8898aa] bg-[#F6F9FC] dark:bg-white/5 px-2 py-1 rounded-full">
                                      via {job.source}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Match badge */}
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <MatchBadge score={job.matchScore} />
                                <span className="text-[10px] font-semibold text-[#697386] dark:text-[#8898aa]">
                                  {job.matchLabel}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 bg-[#0a2540] rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold text-sm">Don't see what you're looking for?</p>
                        <p className="text-white/50 text-xs mt-0.5">Our consultants search beyond public listings too.</p>
                      </div>
                      <a
                        href={`https://wa.me/918074172398?text=${encodeURIComponent(`Hi, I'm looking for ${profile.role} roles. Can you help?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                      >
                        Chat with a consultant
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ ATS RESUME MODAL ════════════════════════════════════════ */}
      <AnimatePresence>
        {showATSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Close */}
                <button
                  onClick={() => setShowATSModal(false)}
                  className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#425466] hover:text-[#0a2540] shadow transition-colors"
                >
                  <X size={16} />
                </button>

                {/* Header strip */}
                <div className="bg-[#0a2540] px-7 py-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#635bff] flex items-center justify-center">
                      <FileText size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Application submitted!</p>
                      <p className="text-white/50 text-xs">
                        {lastAppliedJob ? `${lastAppliedJob.title} at ${lastAppliedJob.company}` : 'Our team will be in touch.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="relative bg-white dark:bg-[#0d1f33] overflow-y-auto flex-1">

                  {/* Blurred resume preview */}
                  <div 
                    id="resume-preview"
                    className="select-none pointer-events-none px-8 pt-8 pb-4 space-y-5"
                    style={{ filter: 'blur(5px)', userSelect: 'none' }}
                  >

                    {/* Resume header */}
                    <div className="text-center border-b border-gray-200 pb-4">
                      <h1 className="text-2xl font-bold text-[#0a2540]">{profile.name || 'Your Name'}</h1>
                      <p className="text-sm text-[#425466] mt-1">
                        {profile.email} &nbsp;|&nbsp; {profile.phone || '+91 XXXXX XXXXX'} &nbsp;|&nbsp; LinkedIn &nbsp;|&nbsp; GitHub
                      </p>
                    </div>

                    {/* Skills */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a2540] mb-2 border-b border-gray-200 pb-1">Technical Skills</h2>
                      <div className="text-xs text-[#425466] space-y-1">
                        <p><span className="font-semibold">Languages:</span> {profile.skills.slice(0, 4).join(', ') || 'JavaScript, Python, SQL, Java'}</p>
                        <p><span className="font-semibold">Frameworks:</span> {profile.skills.slice(4, 8).join(', ') || 'React, Node.js, Express, Spring Boot'}</p>
                        <p><span className="font-semibold">Tools:</span> Git, Docker, Kubernetes, AWS, Jenkins, Jira</p>
                      <p><span className="font-semibold">Databases:</span> MongoDB, PostgreSQL, Redis, MySQL</p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a2540] mb-2 border-b border-gray-200 pb-1">Work Experience</h2>
                    <div className="space-y-3">
                      {[
                        { role: profile.role || 'Senior Software Engineer', company: 'Tech Company Pvt Ltd', period: '2022 – Present', bullets: ['Architected and deployed scalable microservices handling 10M+ requests/day, reducing latency by 40%', 'Led a team of 6 engineers across 3 sprints, delivering features 2 weeks ahead of schedule', 'Implemented CI/CD pipelines reducing deployment time from 2 hours to 12 minutes'] },
                        { role: 'Software Developer', company: 'Startup Inc', period: '2020 – 2022', bullets: ['Built RESTful APIs consumed by 50K+ active users with 99.9% uptime SLA', 'Migrated legacy monolith to microservices, cutting infrastructure cost by 30%'] },
                      ].map((exp, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline">
                            <p className="text-sm font-bold text-[#0a2540]">{exp.role}</p>
                            <p className="text-xs text-[#697386]">{exp.period}</p>
                          </div>
                          <p className="text-xs text-[#425466] font-semibold mb-1">{exp.company}</p>
                          <ul className="space-y-0.5">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="text-xs text-[#425466] flex gap-1.5">
                                <span className="mt-0.5 flex-shrink-0">•</span>{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a2540] mb-2 border-b border-gray-200 pb-1">Education</h2>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0a2540]">B.Tech Computer Science & Engineering</p>
                        <p className="text-xs text-[#425466]">IIT / NIT / Top University — GPA: 8.7 / 10</p>
                      </div>
                      <p className="text-xs text-[#697386]">2016 – 2020</p>
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a2540] mb-2 border-b border-gray-200 pb-1">Projects</h2>
                    <p className="text-xs text-[#425466]">Lorem ipsum project with 12K GitHub stars · React, Node.js, MongoDB · Deployed on AWS</p>
                  </div>
                </div>

                {/* Unlock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-[#0d1f33]/60 backdrop-blur-[2px]">
                  <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.1] rounded-2xl shadow-xl px-8 py-7 text-center max-w-sm mx-4">
                    <div className="w-14 h-14 bg-[#f0effe] dark:bg-[#635bff]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={26} className="text-[#635bff]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0a2540] dark:text-white mb-1">
                      Your ATS Resume is Ready
                    </h3>
                    <p className="text-xs text-[#697386] dark:text-[#8898aa] mb-1">
                      MAANG-grade format · LaTeX / Overleaf template
                    </p>
                    <p className="text-sm text-[#425466] dark:text-[#8898aa] mb-5">
                      Our team will craft a <strong className="text-[#0a2540] dark:text-white">keyword-optimised ATS resume</strong> tailored to {lastAppliedJob?.title || 'your target role'} and beat the screening bots.
                    </p>
                    <div className="space-y-2.5">
                      {/* Admin Features */}
                      {isAdmin && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center justify-center gap-1">
                            <Eye size={12} />
                            Admin Preview
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const resumePreview = document.getElementById('resume-preview');
                                const overlay = e.currentTarget.closest('.absolute.inset-0') as HTMLElement;
                                if (resumePreview && overlay) {
                                  resumePreview.style.filter = 'none';
                                  resumePreview.style.userSelect = 'auto';
                                  resumePreview.classList.remove('pointer-events-none', 'select-none');
                                  overlay.style.display = 'none';
                                  toast({ title: 'Resume Unlocked', description: 'You can now view and interact with the resume' });
                                }
                              }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Eye size={12} />
                              View Resume
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                
                                // Get the resume preview element
                                const resumePreview = document.getElementById('resume-preview');
                                if (!resumePreview) {
                                  toast({ title: 'Error', description: 'Resume preview not found', variant: 'destructive' });
                                  return;
                                }
                                
                                // Clone the element to avoid modifying the original
                                const resumeClone = resumePreview.cloneNode(true) as HTMLElement;
                                
                                // Remove blur and restrictions from clone
                                resumeClone.style.filter = 'none';
                                resumeClone.style.userSelect = 'auto';
                                resumeClone.classList.remove('pointer-events-none', 'select-none');
                                
                                // Create a complete HTML document with styling
                                const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATS Resume - ${profile.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0a2540;
      background: white;
      padding: 40px;
      max-width: 850px;
      margin: 0 auto;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    h2 {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e5e7eb;
    }
    p {
      font-size: 14px;
      color: #425466;
      margin-bottom: 8px;
    }
    .text-center {
      text-align: center;
    }
    .border-b {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .space-y-5 > * + * {
      margin-top: 20px;
    }
    .space-y-3 > * + * {
      margin-top: 12px;
    }
    .space-y-1 > * + * {
      margin-top: 4px;
    }
    .text-xs {
      font-size: 12px;
    }
    .text-sm {
      font-size: 14px;
    }
    .font-semibold {
      font-weight: 600;
    }
    .font-bold {
      font-weight: 700;
    }
    .flex {
      display: flex;
    }
    .justify-between {
      justify-content: space-between;
    }
    .items-baseline {
      align-items: baseline;
    }
    .gap-1 {
      gap: 4px;
    }
    .gap-1\\.5 {
      gap: 6px;
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      display: flex;
      gap: 6px;
      font-size: 12px;
      color: #425466;
      margin-bottom: 4px;
    }
    li span:first-child {
      margin-top: 2px;
      flex-shrink: 0;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  ${resumeClone.innerHTML}
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
    <p style="font-size: 10px; color: #697386;">
      Generated via Saanvi Careers | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>
</body>
</html>
                                `.trim();
                                
                                // Create blob and download
                                const blob = new Blob([htmlContent], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${profile.name.replace(/\s+/g, '_')}_ATS_Resume.html`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                
                                toast({ 
                                  title: 'Resume Downloaded', 
                                  description: 'ATS resume downloaded as HTML. Open in browser and print to PDF.' 
                                });
                              }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Download size={12} />
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <a
                        href={`https://wa.me/918074172398?text=${encodeURIComponent(`Hi! I just applied for ${lastAppliedJob?.title || 'a role'} via Saanvi Careers. I'd like to get my ATS resume built. My name is ${profile.name}.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-3 rounded-full transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Get My ATS Resume via WhatsApp
                      </a>
                      <button
                        onClick={() => setShowATSModal(false)}
                        className="w-full text-xs text-[#697386] hover:text-[#425466] py-2 transition-colors"
                      >
                        Maybe later — continue browsing jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
