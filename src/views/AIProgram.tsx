'use client';

import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Brain,
  Code,
  Briefcase,
  Users,
  Zap,
  Target,
  BookOpen,
  Rocket,
  Shield,
  Building2,
  Layers,
  Search,
  TrendingUp,
  Clock,
  AlertTriangle,
  Star,
  Award,
  BarChart3,
  DollarSign,
  GraduationCap,
  Flame,
  Timer,
  UserCheck,
  CircleDot,
  Download,
  X,
  FileText,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSyllabusPDF } from "@/utils/generateSyllabusPDF";
import { useGetCoursesQuery, useGetMyEnrollmentsQuery } from "@/store/api/appApi";

// WhatsApp links removed - using email instead

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ── Countdown Timer Hook ── */
const useCountdown = () => {
  const getTarget = () => {
    const now = new Date();
    const target = new Date(now);
    // Next Sunday midnight
    target.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    target.setHours(23, 59, 59, 0);
    return target;
  };

  const [target] = useState<Date>(getTarget);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - new Date().getTime();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(tick());
    const id = setInterval(() => setTimeLeft(tick()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
};

/* ── Animated Counter ── */
const AnimatedNumber = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ── Live Enrollment Pulse ── */
const LivePulse = () => (
  <span className="inline-flex items-center gap-1.5">
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
    </span>
    <span className="text-red-600 font-semibold text-xs uppercase tracking-wide">
      Live
    </span>
  </span>
);

/* ── Syllabus Download Modal ── */
const SyllabusModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isValidPhone = (p) => /^\d{10}$/.test(p.trim().replace(/[\s\-]/g, ""));

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !phone.trim()) return;
    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setSending(true);
    setError("");

    try {
      // Send lead email via Resend (fire-and-forget — don't block download on failure)
      fetch('/api/syllabus-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      }).catch(() => {});

      generateSyllabusPDF();
      setDone(true);
    } catch {
      generateSyllabusPDF();
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setName("");
      setPhone("");
      setDone(false);
      setError("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Download Free Syllabus</h3>
                  <p className="text-blue-100 text-sm">14-Day Gen AI Program — Complete Roadmap</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {!done ? (
                <form onSubmit={handleDownload}>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                    Enter your details to get the complete syllabus PDF with day-by-day curriculum, tools, projects & career outcomes.
                  </p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
                          setPhone(val);
                          if (error) setError("");
                        }}
                        placeholder="10-digit mobile number"
                        required
                        maxLength={10}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={sending || !email.trim() || !name.trim() || !phone.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Preparing your PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download Syllabus PDF
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    No spam. We'll only contact you about the Gen AI Program.
                  </p>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Syllabus Downloaded!</h4>
                  <p className="text-gray-500 text-sm mb-5">
                    Check your downloads folder. Ready to start your Gen AI career?
                  </p>
                  <a
                    href="/courses/ai"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.assign('/courses/ai');
                    }}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <MessageCircle size={16} />
                    Enroll Now on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AIProgram = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const countdown = useCountdown();
  const [seatsLeft] = useState(() => Math.floor(Math.random() * 5) + 7); // 7-11
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // RTK Query hooks
  const { data: courses = [] } = useGetCoursesQuery(undefined);
  const { data: enrollments = [] } = useGetMyEnrollmentsQuery(undefined, { skip: !isAuthenticated });

  // Find AI course
  const aiCourse = useMemo(
    () => courses.find((c) => c.slug === 'gen-ai-program'),
    [courses]
  );

  // Check if already enrolled
  const isAlreadyEnrolled = useMemo(
    () => aiCourse && enrollments.some((e) => (e.courseId?._id || e.courseId) === aiCourse._id),
    [aiCourse, enrollments]
  );

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (!aiCourse) {
      alert('Gen AI course not found');
      return;
    }

    if (isAlreadyEnrolled) {
      alert('You are already enrolled in this course!');
      router.push(`/courses/${aiCourse.slug}`);
      return;
    }

    // Navigate to payment flow
    router.push(`/payment/${aiCourse._id}`);
  };

  return (
    <>

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* ==================== URGENCY BANNER ==================== */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2.5 text-center text-sm font-medium mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse" />
          <div className="relative flex items-center justify-center gap-2 flex-wrap px-4">
            <Flame size={16} className="animate-pulse" />
            <span>
              Batch closing in {countdown.days}d {countdown.hours}h{" "}
              {countdown.minutes}m {countdown.seconds}s
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
              Only {seatsLeft} seats left
            </span>
            <Flame size={16} className="animate-pulse" />
          </div>
        </div>

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 pb-16">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left — Text */}
              <motion.div {...fadeUp}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <span className="bg-red-50 border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    Last {seatsLeft} Seats — Price Increases After This Batch
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight"
                >
                  Generative AI Is{" "}
                  <span className="gradient-text">Reshaping Every Industry</span>{" "}
                  Right Now.
                  <br />
                  <span className="text-2xl md:text-3xl mt-2 block text-gray-700">
                    Are you ready — or getting left behind?
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
                >
                  Join 500+ students who went from{" "}
                  <strong>zero Gen AI knowledge to job-ready in just 14 days</strong>
                  . Learn ChatGPT, Prompt Engineering, LLMs & build real Gen AI projects.
                </motion.p>

                {/* Social proof strip */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="flex -space-x-2">
                    {[
                      { initials: "PS", bg: "bg-blue-500" },
                      { initials: "RV", bg: "bg-purple-500" },
                      { initials: "AR", bg: "bg-green-500" },
                      { initials: "SK", bg: "bg-orange-500" },
                    ].map((u, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-white ${u.bg} flex items-center justify-center text-white text-[10px] font-bold`}
                      >
                        {u.initials}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-800">500+</span>{" "}
                    <span className="text-gray-500">
                      students enrolled this month
                    </span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.9/5</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <a
                    href="#enroll" onClick={(e) => { e.preventDefault(); router.push('/courses/ai'); }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-5 rounded-full text-base font-semibold group shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      <MessageCircle className="mr-2" size={20} />
                      Grab Your Seat Now
                      <ArrowRight
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        size={18}
                      />
                    </Button>
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield size={16} className="text-green-500" />
                    <span>Lifetime access included</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right — Image + Stats overlay */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative hidden lg:block"
              >
                <img
                  src="/images/ai-hero.jpg"
                  alt="Generative AI Technology"
                  className="rounded-2xl shadow-2xl w-full object-cover h-[420px]"
                />
                {/* Floating stat cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -left-6 top-8 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Salary Hike</p>
                      <p className="text-sm font-bold text-green-600">+150%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5 }}
                  className="absolute -right-4 bottom-12 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Job-Ready in</p>
                      <p className="text-sm font-bold text-blue-600">
                        14 Days
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute right-8 top-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <LivePulse />
                    <span className="text-xs font-semibold text-gray-700">
                      23 people viewing
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== VIRAL AI STATS (FEAR TRIGGER) ==================== */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
                The Generative AI Boom Is Here
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">
                Gen AI Numbers That Should{" "}
                <span className="text-red-400">Worry You</span> — Or{" "}
                <span className="text-green-400">Motivate You</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  stat: "51",
                  prefix: "$",
                  suffix: "B",
                  label: "Generative AI market size in 2024",
                  source: "— Statista",
                  icon: BarChart3,
                  color: "from-blue-500 to-cyan-400",
                },
                {
                  stat: "72",
                  prefix: "",
                  suffix: "%",
                  label: "Organizations now using Gen AI in at least one function",
                  source: "— McKinsey Global Survey 2024",
                  icon: Building2,
                  color: "from-purple-500 to-pink-400",
                },
                {
                  stat: "200",
                  prefix: "",
                  suffix: "M+",
                  label: "Weekly active ChatGPT users worldwide",
                  source: "— OpenAI, 2024",
                  icon: Users,
                  color: "from-green-500 to-emerald-400",
                },
                {
                  stat: "47",
                  prefix: "",
                  suffix: "%",
                  label: "Higher pay for professionals with Gen AI skills",
                  source: "— Indeed Hiring Trends",
                  icon: DollarSign,
                  color: "from-orange-500 to-yellow-400",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <item.icon size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-extrabold mb-1">
                    {item.prefix}
                    <AnimatedNumber value={item.stat} suffix={item.suffix} />
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.source}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              {...fadeUp}
              className="text-center mt-10 text-lg text-gray-300"
            >
              The question isn't <em>"Should I learn Generative AI?"</em> — it's{" "}
              <strong className="text-white">
                "Can I afford to be the only one who doesn't?"
              </strong>
            </motion.p>
          </div>
        </section>

        {/* ==================== BEFORE vs AFTER ==================== */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Your Career{" "}
                <span className="gradient-text">Before vs After</span> This
                Program
              </h2>
              <p className="text-gray-500">
                Real transformation in just 14 days
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Before */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X2 className="text-red-500" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-red-700">
                    Without Gen AI Skills
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Average salary: ₹3-5 LPA",
                    "No ChatGPT / Prompt Engineering on resume",
                    "Can't build Gen AI tools or workflows",
                    "Watching others get Gen AI roles",
                    "Fear of being replaced by ChatGPT / Copilot",
                    "Confused by LLMs, APIs, Prompt Engineering",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-red-700 text-sm"
                    >
                      <span className="mt-1 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* After */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-8 relative"
              >
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    After 14 Days
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">
                    With Gen AI Skills
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Target salary: ₹8-15 LPA",
                    "Prompt Engineering + LLM skills on resume",
                    "3 real Gen AI projects (Chatbot, Content Gen, Resume Analyzer)",
                    "Confident building with ChatGPT, APIs & AI tools",
                    "Future-proof career in Generative AI",
                    "Placement support & 500+ hiring partners",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-green-700 text-sm"
                    >
                      <CheckCircle
                        size={14}
                        className="mt-0.5 text-green-500 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL PROOF — STUDENT RESULTS ==================== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <LivePulse />
                <span className="text-sm text-gray-500">
                  Real results from real students
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Students Who Said{" "}
                <span className="gradient-text">"Yes" to AI</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Priya Sharma",
                  role: "Fresher → Gen AI Developer",
                  company: "Infosys",
                  salary: "₹8.5 LPA",
                  initials: "PS",
                  bg: "bg-blue-500",
                  quote:
                    "I knew nothing about LLMs or Prompt Engineering. This program taught me to build real Gen AI apps and I cracked my first interview!",
                  rating: 5,
                },
                {
                  name: "Rahul Verma",
                  role: "BPO → Gen AI Automation Lead",
                  company: "TCS",
                  salary: "₹12 LPA",
                  initials: "RV",
                  bg: "bg-purple-500",
                  quote:
                    "From a BPO job to automating workflows with ChatGPT APIs. The Gen AI chatbot project on my resume got me 4 interview calls in one week.",
                  rating: 5,
                },
                {
                  name: "Ananya Reddy",
                  role: "Student → Gen AI Intern",
                  company: "Wipro",
                  salary: "₹6 LPA",
                  initials: "AR",
                  bg: "bg-green-500",
                  quote:
                    "My AI Content Generator project impressed recruiters. They said most candidates only know theory — I had real Gen AI projects to show!",
                  rating: 5,
                },
              ].map((student, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${student.bg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-3">
                    {[...Array(student.rating)].map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 italic">
                    "{student.quote}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-blue-500" />
                      <span className="text-xs font-medium text-gray-600">
                        {student.company}
                      </span>
                    </div>
                    <span className="text-green-600 font-bold text-sm">
                      {student.salary}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enrollment counter */}
            <motion.div
              {...fadeUp}
              className="mt-12 max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    47 enrolled in last 24 hours
                  </p>
                  <p className="text-xs text-gray-500">
                    Batch filling up fast
                  </p>
                </div>
              </div>
              <LivePulse />
            </motion.div>
          </div>
        </section>

        {/* ==================== PROBLEM SECTION ==================== */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Does This Sound Like{" "}
                <span className="gradient-text">You?</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                {[
                  {
                    text: "Worried ChatGPT & Gen AI tools might replace your role",
                    icon: Shield,
                  },
                  {
                    text: "No Prompt Engineering or LLM skills on your resume",
                    icon: Code,
                  },
                  {
                    text: "No real Gen AI projects to show in interviews",
                    icon: Briefcase,
                  },
                  {
                    text: "Confused by ChatGPT, LLMs, APIs, Prompt Engineering",
                    icon: Target,
                  },
                  {
                    text: "Watching Gen AI tutorials but can't build anything real",
                    icon: BookOpen,
                  },
                  {
                    text: "Everyone around you is using Gen AI — except you",
                    icon: Users,
                  },
                ].map((pain, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <pain.icon className="text-red-500" size={20} />
                    </div>
                    <span className="text-gray-700 font-medium text-left">
                      {pain.text}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.p
                {...fadeUp}
                className="mt-10 text-lg text-gray-600 font-medium"
              >
                You're not alone —{" "}
                <span className="text-blue-600 font-semibold">
                  but every day you wait, someone else takes your spot.
                </span>
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== SOLUTION + IMAGE ==================== */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/images/students-learning.jpg"
                  alt="Students learning Generative AI"
                  className="rounded-2xl shadow-xl w-full object-cover h-[350px]"
                />
              </motion.div>

              <motion.div {...fadeUp}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Introducing{" "}
                  <span className="gradient-text">
                    Saanvi Careers Gen AI Program
                  </span>
                </h2>
                <p className="text-gray-600 mb-6">
                  A focused 14-day intensive program designed to make you
                  job-ready in Generative AI with real tools, real-time industry
                  projects, and career support.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: Brain,
                      title: "Learn by Doing",
                      desc: "Real-time industry projects from Day 1",
                    },
                    {
                      icon: Rocket,
                      title: "14-Day Sprint",
                      desc: "Zero to job-ready, fast",
                    },
                    {
                      icon: Users,
                      title: "Placement Support",
                      desc: "Resume, interviews & connections",
                    },
                    {
                      icon: GraduationCap,
                      title: "Lifetime Access",
                      desc: "Learn at your pace, forever",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                    >
                      <item.icon
                        size={20}
                        className="text-blue-500 mb-2"
                      />
                      <p className="font-semibold text-sm text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== REAL-TIME INDUSTRY PROJECTS ==================== */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              {...fadeUp}
              className="max-w-3xl mx-auto text-center mb-14"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Build What{" "}
                <span className="gradient-text">Companies Actually Use</span>
              </h2>
              <p className="text-gray-500">
                Not toy projects — real industry-level use cases that impress
                recruiters
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "AI Customer Support Chatbot",
                  label: "Industry Use Case",
                  desc: "Build a context-aware chatbot using OpenAI API + LangChain with conversation memory, system prompts, and a Streamlit UI — similar to real support bots used at scale.",
                  icon: MessageCircle,
                  image: "/images/project-chatbot.jpg",
                  tools: ["OpenAI API", "LangChain", "Streamlit", "Python"],
                  outcome: "Deployed live chatbot with public URL",
                },
                {
                  title: "AI Content Generator",
                  label: "Business Use Case",
                  desc: "Create a marketing content pipeline that generates blog posts, ad copy, social media captions, and email sequences using advanced prompt engineering and few-shot techniques.",
                  icon: Zap,
                  image: "/images/project-content.jpg",
                  tools: ["ChatGPT API", "Prompt Chains", "Streamlit", "Python"],
                  outcome: "Multi-format content generation tool",
                },
                {
                  title: "AI Resume Analyzer + Job Matcher",
                  label: "Hiring Use Case",
                  desc: "Develop an AI tool that parses resumes, extracts skills using NLP, scores them against job descriptions, and provides improvement suggestions — like real ATS systems.",
                  icon: Search,
                  image: "/images/project-resume.jpg",
                  tools: ["OpenAI API", "PDF Parsing", "Embeddings", "Streamlit"],
                  outcome: "Working resume scoring dashboard",
                },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <project.icon className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold">{project.title}</h3>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {project.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{project.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tools.map((tool) => (
                        <span key={tool} className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-xs font-medium text-green-700">{project.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== WHAT YOU'LL LEARN ==================== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                14-Day <span className="gradient-text">Roadmap</span>
              </h2>
              <p className="text-gray-500 mb-5">
                Structured curriculum — no fluff, all action
              </p>
              <button
                onClick={() => setSyllabusOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl group"
              >
                <Download size={18} />
                Download Complete Syllabus PDF — Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Week labels */}
            <div className="max-w-4xl mx-auto">
              {/* WEEK 1 */}
              <motion.div {...fadeUp} className="mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Week 1: Foundations & Core Skills</h3>
                    <p className="text-xs text-gray-500">From zero to building your first AI app</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      day: "Day 1",
                      title: "Introduction to Generative AI",
                      topics: [
                        "What is Gen AI vs Traditional AI vs Machine Learning",
                        "How LLMs work — tokens, training, inference (simplified)",
                        "Hands-on: Explore ChatGPT, Claude & Gemini side-by-side",
                      ],
                      deliverable: "AI tool comparison report",
                    },
                    {
                      day: "Day 2",
                      title: "Prompt Engineering Mastery",
                      topics: [
                        "The Perfect Prompt Formula — role, context, task, format, constraints",
                        "Zero-shot, few-shot & chain-of-thought prompting",
                        "Hands-on: Build a prompt library for 10 real-world use cases",
                      ],
                      deliverable: "Personal prompt playbook",
                    },
                    {
                      day: "Day 3",
                      title: "AI for Writing, Research & Productivity",
                      topics: [
                        "AI-powered content writing, editing & fact-checking",
                        "Document summarization & research workflows",
                        "Hands-on: Summarize a 20-page PDF, draft a blog post",
                      ],
                      deliverable: "AI writing toolkit with reusable prompts",
                    },
                    {
                      day: "Day 4",
                      title: "AI Image & Visual Content Generation",
                      topics: [
                        "Text-to-image: DALL·E, Midjourney, Stable Diffusion",
                        "Prompt crafting for visual AI & variation techniques",
                        "Hands-on: Generate a brand kit — logos, social media graphics",
                      ],
                      deliverable: "5-image AI visual portfolio",
                    },
                    {
                      day: "Day 5",
                      title: "AI Audio, Video & Multimodal Content",
                      topics: [
                        "Text-to-speech (ElevenLabs), speech-to-text (Whisper)",
                        "AI video generation & multimodal workflows",
                        "Hands-on: Create a 60-second AI video with narration",
                      ],
                      deliverable: "AI multimedia content piece",
                    },
                    {
                      day: "Day 6",
                      title: "Python Foundations for Gen AI",
                      topics: [
                        "Python basics in Google Colab — no installation needed",
                        "Variables, functions, libraries & API basics",
                        "Hands-on: First Python script + first OpenAI API call",
                      ],
                      deliverable: "Simple chatbot in 20 lines of Python",
                    },
                    {
                      day: "Day 7",
                      title: "Build Your First AI Web App",
                      topics: [
                        "OpenAI API deep dive — chat completions, system prompts, parameters",
                        "Building a Streamlit web app from scratch",
                        "Hands-on: Build & deploy a personal AI chatbot",
                      ],
                      deliverable: "Deployed AI chatbot with live URL",
                    },
                  ].map((module, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap mt-0.5">
                          {module.day}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-base font-bold mb-2">{module.title}</h4>
                          <ul className="space-y-1.5 mb-3">
                            {module.topics.map((topic, j) => (
                              <li key={j} className="flex items-start gap-2 text-gray-600 text-sm">
                                <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-3 py-1.5 w-fit">
                            <Award size={12} className="text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">Deliverable: {module.deliverable}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* WEEK 2 */}
              <motion.div {...fadeUp} className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Rocket size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Week 2: Advanced Skills & Portfolio</h3>
                    <p className="text-xs text-gray-500">Industry projects, deployment & career prep</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      day: "Day 8",
                      title: "RAG — Chat with Your Documents",
                      topics: [
                        "What is RAG & why enterprises need it",
                        "Embeddings, vector databases & retrieval pipelines",
                        "Hands-on: Build a 'Chat with PDF' app using LangChain + ChromaDB",
                      ],
                      deliverable: "RAG-powered document Q&A app",
                    },
                    {
                      day: "Day 9",
                      title: "LangChain & AI Workflow Frameworks",
                      topics: [
                        "LangChain architecture — chains, prompts, memory, tools",
                        "Building multi-step AI workflows with data sources",
                        "Hands-on: Build an AI research assistant",
                      ],
                      deliverable: "AI research assistant that searches & summarizes",
                    },
                    {
                      day: "Day 10",
                      title: "AI Agents & Automation",
                      topics: [
                        "What are AI agents — planning, reasoning, tool use",
                        "Building agents that take actions autonomously",
                        "Hands-on: Build an agent that researches a topic & writes a report",
                      ],
                      deliverable: "Autonomous AI research agent",
                    },
                    {
                      day: "Day 11",
                      title: "Industry Project — AI Content Generator",
                      topics: [
                        "Advanced prompt chaining for multi-format content",
                        "Blog posts, ad copy, social media & email generation",
                        "Hands-on: Build & deploy the full AI Content Generator",
                      ],
                      deliverable: "Deployed AI Content Generator tool",
                    },
                    {
                      day: "Day 12",
                      title: "Industry Project — AI Resume Analyzer",
                      topics: [
                        "Resume parsing, skill extraction & job matching with embeddings",
                        "No-code/low-code AI deployment (Streamlit Cloud, HuggingFace Spaces)",
                        "Hands-on: Build & deploy the Resume Analyzer + Job Matcher",
                      ],
                      deliverable: "Deployed Resume Analyzer with live URL",
                    },
                    {
                      day: "Day 13",
                      title: "Portfolio Building & Personal Branding",
                      topics: [
                        "GitHub portfolio setup with professional READMEs",
                        "LinkedIn optimization for Gen AI careers",
                        "Hands-on: Deploy all projects with live URLs, record demo videos",
                      ],
                      deliverable: "Complete portfolio with 5+ deployed projects",
                    },
                    {
                      day: "Day 14",
                      title: "Career Prep, Interviews & Graduation",
                      topics: [
                        "Gen AI interview questions — RAG, prompting, LLM evaluation",
                        "AI-focused resume building & mock interviews",
                        "Placement guidance & connections with 500+ hiring partners",
                      ],
                      deliverable: "AI resume + 3-minute project pitch video",
                    },
                  ].map((module, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap mt-0.5">
                          {module.day}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-base font-bold mb-2">{module.title}</h4>
                          <ul className="space-y-1.5 mb-3">
                            {module.topics.map((topic, j) => (
                              <li key={j} className="flex items-start gap-2 text-gray-600 text-sm">
                                <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-1.5 bg-purple-50 rounded-lg px-3 py-1.5 w-fit">
                            <Award size={12} className="text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700">Deliverable: {module.deliverable}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Graduation summary */}
              <motion.div
                {...fadeUp}
                className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
              >
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-600" />
                  You Graduate With
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "5–7 portfolio projects with live URLs",
                    "Prompt Engineering mastery",
                    "RAG, LangChain & AI Agents experience",
                    "Professional GitHub portfolio",
                    "AI-optimized resume & LinkedIn",
                    "Placement support & interview prep",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Mid-page CTAs */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setSyllabusOpen(true)}
                className="flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Download size={18} />
                Download Free Syllabus PDF
              </button>
              <a
                href="#enroll" onClick={(e) => { e.preventDefault(); router.push('/courses/ai'); }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-sm font-semibold group shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="mr-2" size={18} />
                  Secure Your Seat — Only {seatsLeft} Left
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </Button>
              </a>
            </motion.div>
          </div>
        </section>

        {/* ==================== WHO THIS IS FOR ==================== */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Who Is This <span className="gradient-text">For?</span>
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 mt-10">
                {[
                  {
                    title: "Job Seekers",
                    desc: "Add Gen AI & Prompt Engineering to your resume and stand out.",
                    icon: Target,
                    stat: "3x more interview calls",
                  },
                  {
                    title: "Freshers",
                    desc: "Build real Gen AI projects and get placed — no prior experience needed.",
                    icon: GraduationCap,
                    stat: "95% placement rate",
                  },
                  {
                    title: "Career Switchers",
                    desc: "Transition into Gen AI roles from any background — BPO, sales, marketing, etc.",
                    icon: Zap,
                    stat: "150% avg salary hike",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="text-blue-500" size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                    <span className="inline-block bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                      {item.stat}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                {...fadeUp}
                className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
              >
                <p className="text-lg font-semibold text-gray-800">
                  No prior experience required.{" "}
                  <span className="text-blue-600">
                    If you can use a computer, you can learn this.
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== PRICING SECTION ==================== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-lg mx-auto text-center">
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-10 shadow-lg relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-5 py-1.5 rounded-full animate-pulse">
                    50% OFF — Ends This Week
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  Gen AI Career Program
                </h3>
                <p className="text-gray-500 mb-6">14-Day Intensive Program</p>

                <div className="mb-4">
                  <span className="text-gray-400 line-through text-lg">
                    ₹9,999
                  </span>
                  <div className="text-4xl font-extrabold gradient-text mt-1">
                    ₹4,999
                  </div>
                  <span className="text-gray-500 text-sm">
                    one-time payment
                  </span>
                </div>

                {/* Savings callout */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-6">
                  <p className="text-green-700 text-sm font-semibold">
                    You save ₹5,000 — Less than ₹357/day for 14 days
                  </p>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {[
                    "14-day intensive program",
                    "3 real-world projects",
                    "Resume + interview preparation",
                    "Placement support",
                    "Lifetime access",
                    "WhatsApp community",
                    "Certificate of completion",
                    "Certificate of completion",
                  ].map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <CheckCircle
                        size={18}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling || loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-6 rounded-full text-lg font-semibold group shadow-lg hover:shadow-xl transition-all"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={22} />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2" size={22} />
                      Grab Your Seat Now — Only {seatsLeft} Seats Left
                      <ArrowRight
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 mt-3">
                  Secure payment via WhatsApp. No hidden charges.
                </p>

                {/* Urgency bar */}
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-semibold">
                    <Timer size={16} />
                    Price increases to ₹9,999 after this batch
                  </div>
                  <div className="mt-2 bg-red-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${((30 - seatsLeft) / 30) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    {seatsLeft} of 30 seats remaining
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== FAQ / OBJECTION HANDLING ==================== */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp} className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                Still <span className="gradient-text">Thinking?</span>
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: "I have zero experience in Generative AI. Can I still join?",
                    a: "Absolutely! This program is designed for complete beginners. We teach ChatGPT, Prompt Engineering, and LLMs from scratch. If you can use a computer, you can learn Gen AI.",
                  },
                  {
                    q: "Is ₹4,999 worth it for a Gen AI course?",
                    a: "Gen AI / Prompt Engineering roles pay 47% more on average. Our alumni see salary hikes of 150%. That's a 50-100x return on your investment of ₹4,999.",
                  },
                  {
                    q: "Will I get a job in Generative AI after this?",
                    a: "We provide full placement support — Gen AI-focused resume, mock interviews, and connections with 500+ hiring partners looking for Gen AI talent. 95% placement rate.",
                  },
                  {
                    q: "Do I need to know coding or machine learning?",
                    a: "No! This is a Generative AI program — focused on ChatGPT, Prompt Engineering, AI tools & no-code automation. No coding background required.",
                  },
                  {
                    q: "What if I don't like it?",
                    a: "We're confident you'll love it. If you're not satisfied after Day 2, reach out and we'll work with you to resolve any concerns.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <p className="font-bold text-gray-800 mb-2">{faq.q}</p>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Flame size={16} className="text-orange-300" />
                <span className="text-white/90 text-sm font-medium">
                  {seatsLeft} seats left at ₹4,999
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Your Future Self Will Thank You
              </h2>
              <p className="text-blue-200 mb-8 max-w-xl mx-auto">
                Every day you delay, someone else is learning Generative AI and
                getting the role you deserve. ChatGPT isn't waiting — neither should you.
              </p>

              <a
                href="#enroll" onClick={(e) => { e.preventDefault(); router.push('/courses/ai'); }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 rounded-full text-lg font-bold group shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="mr-2" size={22} />
                  Join Now — Start Tomorrow
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Button>
              </a>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-200">
                {[
                  "Certificate of Completion",
                  "Lifetime Access",
                  "Placement Support",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-400" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Syllabus Download Modal — rendered via portal to avoid parent transform issues */}
      {syllabusOpen && ReactDOM.createPortal(
        <SyllabusModal isOpen={syllabusOpen} onClose={() => setSyllabusOpen(false)} />,
        document.body
      )}
    </>
  );
};

/* Fallback X icon for "Before" section (since lucide X2 doesn't exist) */
const X2 = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default AIProgram;
