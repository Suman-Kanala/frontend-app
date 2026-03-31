'use client';

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  User,
  Building2,
  Briefcase,
  Sparkles,
  Clock,
  LucideIcon,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import NewsTicker from "@/components/NewsTicker";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918074172398";

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

interface ContactProps {
  // Currently no props needed
}

const Contact: React.FC<ContactProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiry_type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.inquiry_type ||
      !formData.message
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || "Not provided",
          company: formData.company || "Not provided",
          inquiry_type: formData.inquiry_type,
          message: formData.message,
          name: formData.name,
          email: formData.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          toast({
            title: "Message Sent!",
            description:
              "Thank you for contacting us. We'll get back to you shortly.",
          });
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            inquiry_type: "",
            message: "",
          });
          setSubmitted(true);
        },
        () => {
          toast({
            title: "Submission Failed",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const inquiryOptions: InquiryOption[] = [
    { label: "Job Seeker", value: "Job Seeker", icon: User },
    { label: "Employer", value: "Employer - Hiring Talent", icon: Building2 },
    { label: "Gen AI Program", value: "Gen AI Program - Course Inquiry", icon: Sparkles },
    { label: "Partnership", value: "Partnership / Collaboration", icon: Briefcase },
  ];

  const inputClass =
    "w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all";

  return (
    <section id="contact" className="py-16 md:py-20 relative bg-gray-50 dark:bg-gray-950" suppressHydrationWarning>
      <div className="container mx-auto px-6" ref={ref} suppressHydrationWarning>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          suppressHydrationWarning
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto">
            Have a question or ready to take the next step? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto items-stretch">

          {/* LEFT: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Contact Cards */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a href="mailto:contact@saanvicareers.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Mail className="text-blue-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">contact@saanvicareers.com</p>
                    <p className="text-xs text-gray-400">Send us an email</p>
                  </div>
                </a>

                <a href="tel:+918074172398" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                    <Phone className="text-green-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">+91 8074172398</p>
                    <p className="text-xs text-gray-400">Mon – Sat, 9 AM – 7 PM IST</p>
                  </div>
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-purple-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Global Presence</p>
                    <p className="text-xs text-gray-400">India, USA, UK, AU, EU, Gulf</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-orange-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Quick Response</p>
                    <p className="text-xs text-gray-400">We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to know about Saanvi Careers")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-3 rounded-2xl transition-all shadow-sm hover:shadow-md hover:shadow-green-500/15 group"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* News Ticker */}
            <NewsTicker />

          </motion.div>

          {/* RIGHT: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Send us a Message</h3>
                <p className="text-xs text-gray-400 mt-0.5">Fields marked with * are required</p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                      <CheckCircle className="text-green-500" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1.5">Message Received!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 max-w-xs">
                      Our team will review and respond within 24 hours.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        Send another
                      </button>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I just submitted a form on your website")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MessageCircle size={14} />
                        Follow up on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-xs font-semibold mb-2 uppercase tracking-wider">
                        I'm interested in <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {inquiryOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, inquiry_type: opt.value })
                            }
                            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-center ${
                              formData.inquiry_type === opt.value
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-sm"
                                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <opt.icon
                              size={18}
                              className={
                                formData.inquiry_type === opt.value
                                  ? "text-blue-500"
                                  : "text-gray-400"
                              }
                            />
                            <span className="text-xs font-medium">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone + Company */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1.5">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className={inputClass}
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-xs font-medium mb-1.5">
                        Your Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us about your requirements, goals, or questions..."
                        required
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 shadow-md hover:shadow-lg hover:shadow-blue-500/15 transition-all group"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-5 pt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckCircle size={12} className="text-green-400" />
                        No spam
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckCircle size={12} className="text-green-400" />
                        24hr response
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckCircle size={12} className="text-green-400" />
                        100% free
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
