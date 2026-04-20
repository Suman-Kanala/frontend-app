'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Video, CheckCircle, Star, 
  ArrowRight, Sparkles, Shield, Building2,
  Target, FileText, TrendingUp, BarChart3, GraduationCap, Lightbulb,
} from 'lucide-react';
export default function CareerGuidancePage() {
  const router = useRouter();

  const benefits = [
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Personalized Career Roadmap',
      description: 'Get a custom career plan tailored to your goals, skills, and industry trends',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Resume & LinkedIn Review',
      description: 'Expert feedback on your resume and LinkedIn profile to stand out to recruiters',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Salary Negotiation Tips',
      description: 'Learn how to negotiate your worth and maximize your compensation package',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Industry Insights',
      description: 'Understand market trends, in-demand skills, and future career opportunities',
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get recommendations for courses and certifications',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Career Transition Guidance',
      description: 'Strategic advice for switching roles, industries, or advancing to leadership',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'TCS',
      rating: 5,
      text: 'The career guidance session was a game-changer! I got clarity on my career path and landed my dream job at TCS within 3 months.',
    },
    {
      name: 'Rahul Verma',
      role: 'Product Manager',
      company: 'Infosys',
      rating: 5,
      text: 'Best investment I made in my career. The mentor helped me transition from engineering to product management seamlessly.',
    },
    {
      name: 'Ananya Patel',
      role: 'Data Scientist',
      company: 'Wipro',
      rating: 5,
      text: 'Incredibly insightful session! Got personalized advice on upskilling and negotiated a 40% salary hike in my next role.',
    },
    {
      name: 'Arjun Mehta',
      role: 'DevOps Engineer',
      company: 'HCL Technologies',
      rating: 4,
      text: 'Great session with actionable insights. Helped me understand the DevOps landscape and plan my certifications strategically.',
    },
    {
      name: 'Sneha Reddy',
      role: 'Business Analyst',
      company: 'Tech Mahindra',
      rating: 5,
      text: 'The mentor provided excellent guidance on transitioning to a BA role. Got placed within 2 months of our session!',
    },
    {
      name: 'Karthik Iyer',
      role: 'Full Stack Developer',
      company: 'Cognizant',
      rating: 4,
      text: 'Very helpful session! Got clarity on which tech stack to focus on and received valuable interview preparation tips.',
    },
  ];

  const features = [
    'Personalized career roadmap',
    'Resume & LinkedIn review',
    'Salary negotiation strategies',
    'Industry insights & trends',
    'Skill gap analysis',
    'Interview preparation tips',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0d14]">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-[#0a0d14] dark:to-[#0a0d14]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-full mb-8">
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">500+ professionals guided to success</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Transform your career with expert guidance
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
              Get personalized 1-on-1 mentorship from industry experts. Navigate your career path, 
              ace interviews, and land your dream job.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/services/career-guidance/book')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
            >
              Book your session
              <ArrowRight size={20} />
            </button>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Instant confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <Video size={16} className="text-blue-600 dark:text-blue-400" />
                <span>1-on-1 video call</span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative p-8 md:p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                Most Popular
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Career Guidance Session
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock size={18} />
                    <span className="font-medium">30 minutes</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹499
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">one-time payment</div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Comprehensive career guidance with personalized roadmap, resume review, and expert insights to accelerate your professional growth.
              </p>

              {/* Features list */}
              <div className="space-y-3 mb-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push('/services/career-guidance/book')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Book your session now
              </button>

              {/* Trust line */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                <Shield size={14} className="inline mr-1" />
                100% secure payment • Instant confirmation • Money-back guarantee
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What you'll get
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive career guidance designed to accelerate your professional growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple 3-step process to book your session
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                icon: <Calendar className="w-6 h-6" />,
                title: 'Choose date & time',
                description: 'Select a convenient slot that works for your schedule',
              },
              {
                step: '2',
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure payment',
                description: 'Pay securely via UPI, cards, or net banking',
              },
              {
                step: '3',
                icon: <Video className="w-6 h-6" />,
                title: 'Join your session',
                description: 'Connect with your career mentor via video call',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/25">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Success stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Hear from professionals who transformed their careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <span className="truncate">{testimonial.role}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Building2 size={12} />
                        <span className="font-medium">{testimonial.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden p-12 md:p-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to accelerate your career?
              </h2>
              <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                Book your personalized career guidance session today and take the first step towards your dream job.
              </p>
              <button
                onClick={() => router.push('/services/career-guidance/book')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-xl"
              >
                Book your session - ₹499
                <ArrowRight size={20} />
              </button>
              <p className="mt-6 text-sm text-blue-100">
                Limited slots • Instant confirmation • 100% secure payment
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
