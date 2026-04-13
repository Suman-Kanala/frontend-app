'use client';

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, MessageCircle,
  CheckCircle, User, Building2, Briefcase, LucideIcon,
  Clock, Globe, Shield,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import NewsTicker from "@/components/NewsTicker";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918074172398";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiry_type: string;
  message: string;
}

interface InquiryOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

const Contact: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [formData, setFormData] = useState<ContactFormData>({
    name: "", email: "", phone: "", company: "", inquiry_type: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.inquiry_type || !formData.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", company: "", inquiry_type: "", message: "" });
      setSubmitted(true);
    } catch {
      toast({ title: "Failed to send", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryOptions: InquiryOption[] = [
    { label: "Job Seeker",  value: "Job Seeker",                  icon: User },
    { label: "Employer",    value: "Employer - Hiring Talent",    icon: Building2 },
    { label: "Partnership", value: "Partnership / Collaboration", icon: Briefcase },
  ];

  const inputClass =
    "w-full px-3.5 py-2.5 bg-[#F6F9FC] dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl text-sm text-[#0a2540] dark:text-white placeholder-[#697386] dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] focus:bg-white dark:focus:bg-white/[0.08] transition-all";

  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#07101d]" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto px-6" ref={ref} suppressHydrationWarning>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold text-[#635bff] uppercase tracking-[0.15em] mb-3 block">Contact</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a2540] dark:text-white mb-4">
            Get in touch.
          </h2>
          <p className="text-[#425466] dark:text-[#8898aa] text-lg max-w-md mx-auto">
            Ready to take the next step? Our team responds within 24 hours.
          </p>
        </motion.div>

        {/* Two-panel card — dark left, white right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid lg:grid-cols-5 rounded-3xl overflow-hidden border border-[#E6EBF1] dark:border-white/[0.07] shadow-xl shadow-[#0a2540]/5"
        >

          {/* ── LEFT: dark info panel ─────────────────────── */}
          <div className="lg:col-span-2 bg-[#0a2540] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Contact Information</h3>
              <p className="text-white/50 text-sm mb-8 leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-5">
                <a href="mailto:contact@saanvicareers.com" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/[0.08] group-hover:bg-[#635bff]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={17} className="text-[#635bff]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/35 font-medium uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-sm font-medium text-white group-hover:text-[#635bff] transition-colors">
                      contact@saanvicareers.com
                    </p>
                  </div>
                </a>

                <a href="tel:+918074172398" className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/[0.08] group-hover:bg-[#635bff]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={17} className="text-[#635bff]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/35 font-medium uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-white group-hover:text-[#635bff] transition-colors">
                      +91 8074172398
                    </p>
                    <p className="text-xs text-white/35 mt-0.5">Mon–Sat, 9 AM – 7 PM IST</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/[0.08] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe size={17} className="text-[#635bff]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/35 font-medium uppercase tracking-wider mb-0.5">Regions</p>
                    <p className="text-sm font-medium text-white">India, USA, UK, Australia</p>
                    <p className="text-xs text-white/35 mt-0.5">EU & Gulf Countries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/[0.08] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={17} className="text-[#635bff]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/35 font-medium uppercase tracking-wider mb-0.5">Response Time</p>
                    <p className="text-sm font-medium text-white">Within 24 hours</p>
                    <p className="text-xs text-white/35 mt-0.5">Usually much faster</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp + trust */}
            <div className="mt-8 space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to know about Saanvi Careers")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-3 rounded-xl transition-colors group"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>

              <div className="flex items-center gap-3 pt-2">
                <Shield size={13} className="text-white/30 flex-shrink-0" />
                <p className="text-xs text-white/30">
                  Your information is private and never shared with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: form ──────────────────────────────── */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0d1f33] p-8 md:p-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-2xl flex items-center justify-center mb-5">
                  <CheckCircle size={30} className="text-[#635bff]" />
                </div>
                <h3 className="text-xl font-bold text-[#0a2540] dark:text-white mb-2">Message Received!</h3>
                <p className="text-[#425466] dark:text-[#8898aa] text-sm mb-6 max-w-xs leading-relaxed">
                  Our team will review your message and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-semibold text-[#635bff] hover:text-[#4f46e5] bg-[#f0effe] hover:bg-[#e8e6ff] px-5 py-2.5 rounded-full transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#425466] dark:text-[#8898aa] uppercase tracking-wider mb-3">
                    I'm reaching out as a <span className="text-red-400">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {inquiryOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, inquiry_type: opt.value })}
                        className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl border text-center transition-all ${
                          formData.inquiry_type === opt.value
                            ? "border-[#635bff] bg-[#f0effe] dark:bg-[#635bff]/10 text-[#635bff]"
                            : "border-[#E6EBF1] dark:border-white/[0.07] text-[#697386] dark:text-[#8898aa] hover:border-[#635bff]/30 hover:bg-[#F6F9FC] dark:hover:bg-white/5"
                        }`}
                      >
                        <opt.icon size={18} className={formData.inquiry_type === opt.value ? "text-[#635bff]" : "text-[#697386] dark:text-[#8898aa]"} />
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      className={inputClass} placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className={inputClass} placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Phone Number
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className={inputClass} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#425466] dark:text-[#8898aa] mb-1.5">
                      Company / Organization
                    </label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange}
                      className={inputClass} placeholder="Your company name" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#425466] dark:text-[#8898aa] mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange}
                    rows={4} className={`${inputClass} resize-none`}
                    placeholder="Tell us about your requirements, goals, or questions..." required />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-60 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#635bff]/20 hover:shadow-[#635bff]/30 transition-all group"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#697386] dark:text-[#8898aa]">
                  No spam, ever. We reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </motion.div>

        {/* Live News & Jobs Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-6xl mx-auto mt-6"
        >
          <NewsTicker />
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
