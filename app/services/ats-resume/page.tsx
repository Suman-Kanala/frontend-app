
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Download, Loader2, CheckCircle,
  Sparkles, Wand2, RefreshCw, ChevronLeft, ChevronRight,
  Star, ArrowRight, Award, Link, Shield, Zap, TrendingUp, Users,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Rating { ats: number; impact: number; technical: number; readability: number; overall: number; }
interface PreGenOptions {
  hasLinkedIn: boolean; linkedInUrl: string;
  hasGitHub: boolean; gitHubUrl: string;
  hasCertifications: boolean; certificationsText: string;
}

// Saanvi Careers brand colors only
const BRAND = { purple: '#635bff', dark: '#0a2540', mid: '#425466', light: '#697386', bg: '#F6F9FC', border: '#E6EBF1' };

const VARIANTS = [
  { label: 'Classic',  full: 'Classic',  sub: 'Clean & Professional',  color: '#635bff' },
  { label: 'Impact',   full: 'Impact',   sub: 'Results-Focused',       color: '#0a2540' },
  { label: 'Executive',full: 'Executive',sub: 'Modern & Authoritative', color: '#425466' },
];

type Step = 'upload' | 'role' | 'linkedin' | 'github' | 'certifications' | 'generated';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={e => { e.stopPropagation(); onToggle(); }}
      className="flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
      style={{ backgroundColor: on ? '#635bff' : 'rgba(255,255,255,0.2)' }}>
      <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? 'translateX(24px)' : 'translateX(4px)' }} />
    </button>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between mb-0.5">
        <span className="text-[10px] text-[#697386]">{label}</span>
        <span className="text-[10px] font-semibold text-[#0a2540]">{value}/10</span>
      </div>
      <div className="h-1 bg-[#E6EBF1] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(value, 10) * 10}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function ATSResumePage() {
  const [step, setStep] = useState<Step>('upload');
  const [showLanding, setShowLanding] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [jobProfile, setJobProfile] = useState('');
  const [options, setOptions] = useState<PreGenOptions>({
    hasLinkedIn: false, linkedInUrl: '', hasGitHub: false, gitHubUrl: '', hasCertifications: false, certificationsText: '',
  });
  const [modifications, setModifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [modLoading, setModLoading] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [activeVariant, setActiveVariant] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [jdMode, setJdMode] = useState(false);
  const [jdText, setJdText] = useState('');

  const isValidFile = (f: File) => {
    const types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return types.includes(f.type) || ['.pdf', '.doc', '.docx'].some(e => f.name.toLowerCase().endsWith(e));
  };

  const isValidUrl = (url: string) => { try { new URL(url); return true; } catch { return false; } };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && isValidFile(f)) setFile(f); else toast({ title: 'PDF, DOC or DOCX only', variant: 'destructive' });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && isValidFile(f)) setFile(f); else toast({ title: 'PDF, DOC or DOCX only', variant: 'destructive' });
  };

  const handleGenerate = async () => {
    setLoading(true); setVariants([]); setRatings([]); setStep('generated');
    try {
      const fd = new FormData();
      if (pasteMode && pastedText.trim()) {
        const blob = new Blob([pastedText], { type: 'text/plain' });
        fd.append('resume', blob, 'resume.txt');
      } else {
        fd.append('resume', file!);
      }
      fd.append('jobProfile', jobProfile);
      fd.append('jdText', jdMode ? jdText : '');
      fd.append('options', JSON.stringify(options));
      const res = await fetch('/api/ats-resume/generate', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVariants(data.variants || []); setRatings(data.ratings || []); setActiveVariant(0);
      toast({ title: '3 Resume Variants Ready!' });
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
      setStep('certifications');
    } finally { setLoading(false); }
  };

  const handleModify = async () => {
    if (!modifications.trim()) { toast({ title: 'Describe changes', variant: 'destructive' }); return; }
    setModLoading(true);
    try {
      const res = await fetch('/api/ats-resume/modify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentResume: variants[activeVariant], modifications, jobProfile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = [...variants]; updated[activeVariant] = data.resumeHtml;
      setVariants(updated); setModifications(''); toast({ title: 'Done!' });
    } catch (err: any) { toast({ title: 'Failed', description: err.message, variant: 'destructive' }); }
    finally { setModLoading(false); }
  };

  const reset = () => {
    setStep('upload'); setShowLanding(false); setFile(null); setJobProfile(''); setVariants([]); setRatings([]);
    setModifications(''); setFieldErrors({}); setPasteMode(false); setPastedText('');
    setJdMode(false); setJdText('');
    setOptions({ hasLinkedIn: false, linkedInUrl: '', hasGitHub: false, gitHubUrl: '', hasCertifications: false, certificationsText: '' });
  };

  const downloadPDF = () => {
    const html = variants[activeVariant]; if (!html) return;
    const clean = html.replace(/<title[^>]*>.*?<\/title>/gi, '<title>Resume</title>');
    const css = `<style>@page{margin:0.5in;size:A4}@media print{*{-webkit-print-color-adjust:exact!important}}</style><script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>`;
    const final = clean.includes('</head>') ? clean.replace('</head>', css + '</head>') : css + clean;
    const w = window.open(URL.createObjectURL(new Blob([final], { type: 'text/html;charset=utf-8' })), '_blank');
    if (!w) toast({ title: 'Popup blocked', variant: 'destructive' });
  };

  const downloadHTML = () => {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([variants[activeVariant]], { type: 'text/html' })),
      download: `saanvi-resume-v${activeVariant + 1}.html`,
    }); a.click();
  };

  const hasResumes = variants.length > 0;
  const activeColor = VARIANTS[activeVariant]?.color ?? '#635bff';
  const activeRating = ratings[activeVariant];

  // ── LANDING PAGE ──
  if (showLanding) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#060e1d]">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle at 40% 40%, rgba(99,91,255,0.12) 0%, transparent 65%)' }} />
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle at 60% 60%, rgba(0,212,255,0.07) 0%, transparent 65%)' }} />
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,91,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', opacity: 0.2 }} />

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 bg-[#f0effe] dark:bg-[#635bff]/15 text-[#635bff] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#635bff]/20">
                <Sparkles size={14} /> Saanvi Careers · ATS Resume Builder
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0a2540] dark:text-white leading-[1.05] mb-6">
              Stop getting rejected.
              <span className="block bg-gradient-to-r from-[#635bff] via-[#7a73ff] to-[#0a2540] dark:to-[#a5a0ff] bg-clip-text text-transparent">
                Start getting hired.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xl text-[#425466] dark:text-[#8898aa] max-w-2xl mx-auto mb-4 leading-relaxed">
              <strong className="text-[#0a2540] dark:text-white">75% of resumes never reach a human.</strong> ATS filters reject them automatically. Saanvi Careers rewrites yours from scratch — 3 variants, fully optimized, ready to get you shortlisted.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-[#635bff] font-semibold mb-10">
              ✓ Free to use &nbsp;·&nbsp; ✓ No account needed &nbsp;·&nbsp; ✓ PDF & Word supported
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
              <button onClick={() => setShowLanding(false)}
                className="inline-flex items-center gap-2.5 bg-[#635bff] hover:bg-[#4f46e5] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-[#635bff]/30 hover:shadow-[#635bff]/50 hover:-translate-y-0.5 transition-all duration-200 group">
                Build My Resume — Free
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* Social proof avatars */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-16">
              <div className="flex -space-x-2">
                {['#635bff','#0a2540','#425466','#697386'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#060e1d] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                    {['S','R','A','K'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#425466] dark:text-[#8898aa]">
                <span className="font-bold text-[#0a2540] dark:text-white">500+</span> professionals got shortlisted this month
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-0 divide-x divide-[#E6EBF1] dark:divide-white/[0.08] mb-20">
              {[
                { number: '3', label: 'Resume Variants' },
                { number: '8.5+', label: 'Quality Score' },
                { number: '100%', label: 'ATS Optimized' },
                { number: '2 min', label: 'Generation Time' },
              ].map((s, i) => (
                <div key={i} className="text-center px-7 py-2">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">{s.number}</div>
                  <div className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5 font-medium uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-[#F6F9FC] dark:bg-[#060e1d]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">Why Saanvi Careers Resume</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a2540] dark:text-white mb-4">Built to get you hired.</h2>
              <p className="text-[#425466] dark:text-[#8898aa] max-w-xl mx-auto">Not just a template. A complete rewrite by Saanvi Careers — built on 3,200+ successful placements.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Shield size={22} />, title: 'Bypasses Every ATS Filter', desc: 'Engineered with exact keywords, standard headings, and clean formatting that ATS systems love.' },
                { icon: <TrendingUp size={22} />, title: '3 Tailored Variants', desc: 'Professional, Impact-Driven, and Modern Edge — pick the one that fits your target company.' },
                { icon: <Zap size={22} />, title: 'Rewrites From Scratch', desc: 'We keep only your personal details. Everything else is rewritten to sound like a top-tier professional.' },
                { icon: <Users size={22} />, title: 'Trusted by 500+ Professionals', desc: 'Saanvi Careers has placed 3,200+ candidates. This tool is built on that expertise.' },
                { icon: <Sparkles size={22} />, title: 'Self-Critiqued Output', desc: 'Saanvi Careers reviews and improves the output before delivering — minimum 8.5/10 quality score.' },
                { icon: <FileText size={22} />, title: 'PDF & HTML Download', desc: 'Download as print-ready PDF or HTML. No watermarks, no subscriptions.' },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl hover:border-[#635bff]/40 hover:shadow-lg hover:shadow-[#635bff]/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#f0effe] dark:bg-[#635bff]/10 flex items-center justify-center text-[#635bff] mb-4">{f.icon}</div>
                  <h3 className="font-bold text-[#0a2540] dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[#697386] dark:text-[#8898aa] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden p-12 bg-[#0a2540] rounded-3xl text-center">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.25) 0%, transparent 65%)' }} />
              <div className="relative z-10">
                <h2 className="text-4xl font-extrabold text-white mb-4">Ready to get shortlisted?</h2>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">Upload your resume and let Saanvi Careers transform it into a job-winning document in under 2 minutes.</p>
                <button onClick={() => setShowLanding(false)}
                  className="inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-[#635bff]/30 transition-all hover:-translate-y-0.5">
                  <Sparkles size={18} /> Build My Resume — Free
                </button>
                <p className="mt-4 text-xs text-white/40">No account required · PDF & Word supported · 3 variants generated</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── 5-STEP FLOW ──
  if (step !== 'generated') {
    const STEPS = [
      { number: '01', title: 'Upload Resume', description: 'Upload your current resume', detail: 'We extract only your personal details — name, contact, education, company names. Everything else is rewritten from scratch.', pills: ['PDF, DOC, DOCX', 'Secure', 'Auto-extract'] },
      { number: '02', title: 'Target Role', description: 'Enter a job role or paste a full job description', detail: 'Job Role mode: enter the role title for a tailored resume. JD Matcher mode: paste the full job description — we extract every keyword and requirement to build a resume that matches 90%+ of the JD.', pills: ['Job Role', 'JD Matcher', '90% match'] },
      { number: '03', title: 'LinkedIn Profile', description: 'Add your LinkedIn URL (optional)', detail: 'Recruiters verify LinkedIn before calling. Including your URL signals professionalism and gives hiring managers more context.', pills: ['Optional', 'Boosts credibility', 'Recruiter verified'] },
      { number: '04', title: 'GitHub Profile', description: 'Add your GitHub URL (optional)', detail: 'For technical roles, a GitHub profile is a strong signal. It shows real projects and coding activity a resume alone cannot convey.', pills: ['Optional', 'For tech roles', 'Shows real work'] },
      { number: '05', title: 'Certifications', description: 'Include certifications (optional)', detail: 'Certifications from AWS, Google, Microsoft are strong ATS keywords. Including them can significantly boost your score.', pills: ['Optional', 'ATS keywords', 'Boosts score'] },
    ];

    const stepKeys: Step[] = ['upload', 'role', 'linkedin', 'github', 'certifications'];
    const currentIdx = stepKeys.indexOf(step as Step);
    const cur = STEPS[currentIdx];

    const validate = (): boolean => {
      const errs: Record<string, string> = {};
      if (step === 'upload' && !file && !(pasteMode && pastedText.trim())) errs.file = pasteMode ? 'Please paste your resume text' : 'Please upload your resume';
      if (step === 'role' && !jdMode && !jobProfile.trim()) errs.role = 'Please enter your target role';
      if (step === 'role' && jdMode && !jdText.trim()) errs.role = 'Please paste the job description';
      if (step === 'linkedin' && options.hasLinkedIn) {
        if (!options.linkedInUrl.trim()) errs.linkedin = 'Please enter your LinkedIn URL';
        else if (!isValidUrl(options.linkedInUrl)) errs.linkedin = 'Please enter a valid URL (e.g. https://linkedin.com/in/yourname)';
        else if (!options.linkedInUrl.toLowerCase().includes('linkedin')) errs.linkedin = 'URL must be a LinkedIn profile link';
      }
      if (step === 'github' && options.hasGitHub) {
        if (!options.gitHubUrl.trim()) errs.github = 'Please enter your GitHub URL';
        else if (!isValidUrl(options.gitHubUrl)) errs.github = 'Please enter a valid URL (e.g. https://github.com/yourusername)';
        else if (!options.gitHubUrl.toLowerCase().includes('github')) errs.github = 'URL must be a GitHub profile link';
      }
      if (step === 'certifications' && options.hasCertifications && !options.certificationsText.trim())
        errs.certifications = 'Please enter your certifications';
      setFieldErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
      if (!validate()) return;
      const next = stepKeys[currentIdx + 1];
      if (next) setStep(next as Step); else handleGenerate();
    };

    return (
      <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">Saanvi Careers · ATS Resume Builder</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white mb-3">Build your resume</h1>
            <p className="text-[#425466] dark:text-[#8898aa] max-w-md mx-auto">5 quick steps · 3 professional variants · ATS-optimized</p>
          </div>

          {/* Progress strip */}
          <div className="relative flex items-start justify-between mb-8 max-w-2xl mx-auto">
            <div className="absolute left-5 right-5 top-5 h-px bg-[#E6EBF1] dark:bg-white/[0.08] z-0" />
            <div className="absolute left-5 top-5 h-px bg-[#635bff] z-0 transition-all duration-500"
              style={{ right: `calc(${((STEPS.length - 1 - currentIdx) / (STEPS.length - 1)) * 100}% - 2px)` }} />
            {STEPS.map((s, i) => {
              const done = i < currentIdx; const active = i === currentIdx;
              return (
                <button key={i} onClick={() => { if (i < currentIdx) setStep(stepKeys[i] as Step); }}
                  className="relative z-10 flex flex-col items-center gap-2 outline-none" style={{ width: `${100 / STEPS.length}%` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border-2 transition-all duration-300"
                    style={{ background: done || active ? '#635bff' : 'white', borderColor: done || active ? '#635bff' : '#E6EBF1', color: done || active ? 'white' : '#697386', boxShadow: active ? '0 0 0 4px rgba(99,91,255,0.15)' : 'none' }}>
                    {done ? <CheckCircle size={14} /> : <span className="text-xs">{s.number}</span>}
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight hidden sm:block" style={{ color: active ? '#0a2540' : '#697386' }}>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
              className="relative bg-[#0a2540] rounded-3xl overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,91,255,0.22) 0%, transparent 65%)' }} />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)' }} />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 font-extrabold text-white select-none pointer-events-none" style={{ fontSize: 180, lineHeight: 1, opacity: 0.03 }}>{cur.number}</div>

              <div className="relative z-10 grid md:grid-cols-2">
                {/* Left */}
                <div className="p-8 md:p-12 flex flex-col justify-between min-h-[400px]">
                  <div>
                    <span className="text-[#635bff] text-[10px] font-bold uppercase tracking-[0.2em] block mb-4">Step {cur.number} of 05</span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">{cur.title}</h2>
                    <p className="text-white/60 text-sm mb-8">{cur.description}</p>

                    {/* Step 1: Upload */}
                    {step === 'upload' && (
                      <div className="space-y-3">
                        {/* Tab switcher */}
                        <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                          <button type="button" onClick={() => { setPasteMode(false); setFieldErrors({}); }}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${!pasteMode ? 'bg-[#635bff] text-white' : 'text-white/50 hover:text-white/80'}`}>
                            Upload File
                          </button>
                          <button type="button" onClick={() => { setPasteMode(true); setFile(null); setFieldErrors({}); }}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${pasteMode ? 'bg-[#635bff] text-white' : 'text-white/50 hover:text-white/80'}`}>
                            Paste Text
                          </button>
                        </div>

                        {!pasteMode ? (
                          <div>
                            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive ? 'border-[#635bff] bg-[#635bff]/10' : 'border-white/20 hover:border-[#635bff]/60'}`}>
                              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                              {file ? (
                                <div className="flex items-center justify-center gap-3">
                                  <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                                  <div className="text-left"><p className="font-semibold text-white text-sm">{file.name}</p><p className="text-xs text-white/40">{(file.size/1024/1024).toFixed(2)} MB</p></div>
                                  <button onClick={e => { e.stopPropagation(); setFile(null); }} className="ml-2 text-xs text-red-400 hover:text-red-300">✕</button>
                                </div>
                              ) : (
                                <><Upload size={24} className="mx-auto text-white/30 mb-2" /><p className="text-sm font-medium text-white/70">Drop your resume here</p><p className="text-xs text-white/30 mt-1">PDF, DOC, or DOCX</p></>
                              )}
                            </div>
                            {fieldErrors.file && <p className="mt-2 text-xs text-red-400">{fieldErrors.file}</p>}
                          </div>
                        ) : (
                          <div>
                            <textarea
                              value={pastedText}
                              onChange={e => { setPastedText(e.target.value); setFieldErrors({}); }}
                              rows={8}
                              autoFocus
                              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 resize-none ${fieldErrors.file ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder="Paste your complete resume text here — name, email, phone, education, experience, skills, projects..."
                            />
                            {fieldErrors.file && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.file}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Role */}
                    {step === 'role' && (
                      <div className="space-y-3">
                        {/* Mode tabs */}
                        <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                          <button type="button" onClick={() => { setJdMode(false); setJdText(''); setFieldErrors({}); }}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${!jdMode ? 'bg-[#635bff] text-white' : 'text-white/50 hover:text-white/80'}`}>
                            Job Role
                          </button>
                          <button type="button" onClick={() => { setJdMode(true); setJobProfile(''); setFieldErrors({}); }}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${jdMode ? 'bg-[#635bff] text-white' : 'text-white/50 hover:text-white/80'}`}>
                            JD Matcher
                          </button>
                        </div>

                        {!jdMode ? (
                          <div>
                            <input type="text" value={jobProfile}
                              onChange={e => { setJobProfile(e.target.value); setFieldErrors({}); }}
                              onKeyDown={e => e.key === 'Enter' && handleNext()}
                              autoFocus
                              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 ${fieldErrors.role ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder="e.g., Senior DevOps Engineer at Google" />
                            {fieldErrors.role && <p className="mt-2 text-xs text-red-400">{fieldErrors.role}</p>}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded bg-[#635bff]/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles size={11} className="text-[#635bff]" />
                              </div>
                              <p className="text-xs text-white/60">Paste the full job description — we'll extract keywords and match your resume 90%+ to the JD</p>
                            </div>
                            <textarea
                              value={jdText}
                              onChange={e => { setJdText(e.target.value); setFieldErrors({}); }}
                              rows={7}
                              autoFocus
                              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 resize-none ${fieldErrors.role ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder="Paste the complete job description here...&#10;&#10;We'll extract: job title, required skills, responsibilities, keywords — and build your resume to match 90%+ of the JD requirements."
                            />
                            {fieldErrors.role && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.role}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: LinkedIn */}
                    {step === 'linkedin' && (
                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#635bff]/20 flex items-center justify-center"><Link size={14} className="text-[#635bff]" /></div>
                            <span className="text-sm font-semibold text-white">Include LinkedIn</span>
                          </div>
                          <Toggle on={options.hasLinkedIn} onToggle={() => { setOptions(o => ({ ...o, hasLinkedIn: !o.hasLinkedIn, linkedInUrl: '' })); setFieldErrors({}); }} />
                        </div>
                        {options.hasLinkedIn && (
                          <div className="px-4 pb-4 border-t border-white/5">
                            <input type="url" value={options.linkedInUrl} onChange={e => { setOptions(o => ({ ...o, linkedInUrl: e.target.value })); setFieldErrors({}); }} autoFocus
                              className={`w-full mt-3 px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 ${fieldErrors.linkedin ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder="https://linkedin.com/in/yourprofile" />
                            {fieldErrors.linkedin && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.linkedin}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: GitHub */}
                    {step === 'github' && (
                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><FileText size={14} className="text-white/60" /></div>
                            <span className="text-sm font-semibold text-white">Include GitHub</span>
                          </div>
                          <Toggle on={options.hasGitHub} onToggle={() => { setOptions(o => ({ ...o, hasGitHub: !o.hasGitHub, gitHubUrl: '' })); setFieldErrors({}); }} />
                        </div>
                        {options.hasGitHub && (
                          <div className="px-4 pb-4 border-t border-white/5">
                            <input type="url" value={options.gitHubUrl} onChange={e => { setOptions(o => ({ ...o, gitHubUrl: e.target.value })); setFieldErrors({}); }} autoFocus
                              className={`w-full mt-3 px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 ${fieldErrors.github ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder="https://github.com/yourusername" />
                            {fieldErrors.github && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.github}</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 5: Certifications */}
                    {step === 'certifications' && (
                      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center"><Award size={14} className="text-amber-400" /></div>
                            <div><p className="text-sm font-semibold text-white">Include Certifications</p><p className="text-xs text-white/40">Add a certifications section</p></div>
                          </div>
                          <Toggle on={options.hasCertifications} onToggle={() => { setOptions(o => ({ ...o, hasCertifications: !o.hasCertifications, certificationsText: '' })); setFieldErrors({}); }} />
                        </div>
                        {options.hasCertifications && (
                          <div className="px-4 pb-4 border-t border-white/5">
                            <p className="text-xs text-white/40 mt-3 mb-2">List your certifications (one per line)</p>
                            <textarea value={options.certificationsText} onChange={e => { setOptions(o => ({ ...o, certificationsText: e.target.value })); setFieldErrors({}); }} autoFocus rows={4}
                              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/50 resize-none ${fieldErrors.certifications ? 'border-red-500/60' : 'border-white/10'}`}
                              placeholder={'AWS Certified Solutions Architect – 2024\nGoogle Cloud Professional – 2023\nCertified Scrum Master – 2023'} />
                            {fieldErrors.certifications && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.certifications}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nav */}
                  <div className="flex items-center gap-3 mt-8">
                    {currentIdx > 0 && (
                      <button onClick={() => setStep(stepKeys[currentIdx - 1] as Step)}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all">
                        <ArrowRight size={14} className="rotate-180" />
                      </button>
                    )}
                    <button onClick={handleNext} disabled={loading}
                      className="flex items-center gap-2 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-[#635bff]/30">
                      {loading ? <><Loader2 size={14} className="animate-spin" />Generating...</>
                        : currentIdx === STEPS.length - 1 ? <><Sparkles size={14} />Generate My Resumes</>
                        : <>Next step <ArrowRight size={13} /></>}
                    </button>
                    <div className="flex items-center gap-1.5 ml-1">
                      {STEPS.map((_, i) => (
                        <div key={i} className="rounded-full transition-all duration-300"
                          style={{ width: i === currentIdx ? 20 : 6, height: 6, background: i === currentIdx ? '#635bff' : 'rgba(255,255,255,0.18)' }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="p-8 md:p-12 flex flex-col justify-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(99,91,255,0.18)' }}>
                    {step === 'upload' && <Upload size={24} className="text-[#635bff]" />}
                    {step === 'role' && <Sparkles size={24} className="text-[#635bff]" />}
                    {step === 'linkedin' && <Link size={24} className="text-[#635bff]" />}
                    {step === 'github' && <FileText size={24} className="text-[#635bff]" />}
                    {step === 'certifications' && <Award size={24} className="text-[#635bff]" />}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#635bff] mb-3">Why this matters</p>
                  <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-white/55 text-sm leading-relaxed">{cur.detail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cur.pills.map(t => <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold text-white/50 border border-white/10">{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Trust strip */}
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            {[
              { stat: '3 Variants', label: 'Professional, Impact-Driven, Modern Edge' },
              { stat: '8.5+ Score', label: 'Minimum quality guarantee' },
              { stat: '100% Rewrite', label: 'Only your personal details kept' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl px-5 py-4">
                <div className="w-10 h-10 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-[#635bff]" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-[#0a2540] dark:text-white tracking-tight">{item.stat}</p>
                  <p className="text-xs text-[#697386] dark:text-[#8898aa] font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── GENERATED WORKSPACE ──
  return (
    <div className="flex flex-col bg-[#F6F9FC] dark:bg-[#060e1d]" style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 10 }}>

      {/* TOOLBAR */}
      <div className="flex-shrink-0 h-11 bg-white dark:bg-[#0d1f33] border-b border-[#E6EBF1] dark:border-white/[0.07] flex items-center px-4 gap-3">
        <div className="flex gap-1">
          {VARIANTS.map((v, i) => {
            const isActive = activeVariant === i && hasResumes;
            return (
              <button key={i} onClick={() => hasResumes && setActiveVariant(i)} disabled={!hasResumes}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all border ${isActive ? 'text-white border-transparent' : 'bg-white dark:bg-[#0d1f33] border-[#E6EBF1] dark:border-white/[0.07] text-[#425466] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white disabled:opacity-30'}`}
                style={isActive ? { backgroundColor: v.color, borderColor: v.color } : {}}>
                {v.label}
                {ratings[i] && <span className={`ml-1 text-[10px] ${isActive ? 'text-white/80' : 'text-[#697386]'}`}>{ratings[i].overall}</span>}
              </button>
            );
          })}
        </div>

        {hasResumes && activeRating && (
          <>
            <div className="w-px h-4 bg-[#E6EBF1] dark:bg-white/[0.07]" />
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11}
                  className={s <= Math.round(activeRating.overall / 2) ? 'fill-current' : 'text-[#E6EBF1] dark:text-white/10'}
                  style={s <= Math.round(activeRating.overall / 2) ? { color: activeColor } : {}} />
              ))}
            </div>
          </>
        )}

        <div className="flex-1" />

        {hasResumes && (
          <div className="flex items-center gap-1.5">
            <button onClick={reset} className="p-1.5 text-[#697386] hover:text-[#0a2540] dark:hover:text-white hover:bg-[#F6F9FC] dark:hover:bg-white/5 rounded transition-colors" title="Start over">
              <RefreshCw size={13} />
            </button>
            <button onClick={downloadHTML}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#425466] dark:text-[#8898aa] bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] hover:bg-[#F6F9FC] rounded-md transition-colors">
              <Download size={11} /> HTML
            </button>
            <button onClick={downloadPDF}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white rounded-md transition-colors shadow-sm"
              style={{ backgroundColor: activeColor }}>
              <Download size={11} /> Save PDF
            </button>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div key="sidebar" initial={{ width: 0 }} animate={{ width: 264 }} exit={{ width: 0 }} transition={{ duration: 0.18 }}
              className="flex-shrink-0 overflow-hidden bg-white dark:bg-[#0d1f33] border-r border-[#E6EBF1] dark:border-white/[0.07]">
              <div className="w-[264px] h-full overflow-y-auto overflow-x-hidden p-4 space-y-5">

                <div className="flex items-center gap-2 px-3 py-2 bg-[#F6F9FC] dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.07] rounded-lg">
                  <FileText size={14} className="text-[#635bff] flex-shrink-0" />
                  <p className="text-xs text-[#425466] dark:text-[#8898aa] truncate">{file?.name}</p>
                </div>

                {ratings.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-[#697386] uppercase tracking-widest mb-2">Scores</p>
                    <div className="space-y-2">
                      {ratings.map((r, i) => (
                        <div key={i} onClick={() => setActiveVariant(i)}
                          className="p-3 rounded-xl border cursor-pointer transition-all"
                          style={activeVariant === i ? { borderColor: VARIANTS[i].color, backgroundColor: VARIANTS[i].color + '0d' } : { borderColor: '#E6EBF1' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded text-white text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: VARIANTS[i].color }}>{i + 1}</span>
                              <span className="text-xs font-semibold text-[#0a2540] dark:text-white">{VARIANTS[i].full}</span>
                            </div>
                            <span className="text-sm font-bold" style={{ color: VARIANTS[i].color }}>{r.overall}</span>
                          </div>
                          <ScoreBar label="ATS" value={r.ats} color={VARIANTS[i].color} />
                          <ScoreBar label="Impact" value={r.impact} color={VARIANTS[i].color} />
                          <ScoreBar label="Technical" value={r.technical} color={VARIANTS[i].color} />
                          <ScoreBar label="Readability" value={r.readability} color={VARIANTS[i].color} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasResumes && (
                  <div>
                    <p className="text-[9px] font-bold text-[#697386] uppercase tracking-widest mb-2">Modify V{activeVariant + 1}</p>
                    <textarea value={modifications} onChange={e => setModifications(e.target.value)} rows={3}
                      className="w-full px-3 py-2 bg-[#F6F9FC] dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.07] rounded-lg text-xs text-[#0a2540] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 resize-none"
                      placeholder="e.g. Add more cloud skills, stronger summary..." />
                    <button onClick={handleModify} disabled={modLoading || !modifications.trim()}
                      className="mt-2 w-full py-2 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                      {modLoading ? <><Loader2 size={11} className="animate-spin" />Applying...</> : <><Wand2 size={11} />Apply Modifications</>}
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOGGLE */}
        <button onClick={() => setSidebarOpen(v => !v)}
          className="flex-shrink-0 w-4 bg-[#F6F9FC] dark:bg-[#0a1628] hover:bg-[#E6EBF1] dark:hover:bg-white/5 border-r border-[#E6EBF1] dark:border-white/[0.07] flex items-center justify-center transition-colors">
          {sidebarOpen ? <ChevronLeft size={11} className="text-[#697386]" /> : <ChevronRight size={11} className="text-[#697386]" />}
        </button>

        {/* PREVIEW */}
        <div className="flex-1 overflow-auto bg-[#E6EBF1] dark:bg-[#060e1d] p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-[#f0effe] dark:border-[#635bff]/20 border-t-[#635bff] animate-spin" />
                <Sparkles size={16} className="absolute inset-0 m-auto text-[#635bff]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[#0a2540] dark:text-white mb-2 text-sm">Building your resume...</p>
                <div className="space-y-0.5 text-xs text-[#697386] dark:text-[#8898aa]">
                  <p>① Extracting your personal details</p>
                  <p>② Rewriting as a top-tier professional</p>
                  <p>③ Generating 3 polished variants</p>
                  <p>④ Scoring each variant</p>
                </div>
              </div>
            </div>
          ) : hasResumes ? (
            <AnimatePresence mode="wait">
              <motion.div key={activeVariant} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '820px' }}>
                <iframe srcDoc={variants[activeVariant]} className="w-full border-0" style={{ minHeight: '1100px' }}
                  onLoad={e => { try { const h = e.currentTarget.contentDocument?.body?.scrollHeight; if (h) e.currentTarget.style.height = (h + 40) + 'px'; } catch {} }}
                  title={`Resume Variant ${activeVariant + 1}`} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] flex items-center justify-center shadow-sm">
                <FileText size={24} className="text-[#E6EBF1] dark:text-white/20" />
              </div>
              <p className="text-sm text-[#697386] dark:text-[#8898aa]">No resume generated yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
