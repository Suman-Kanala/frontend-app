'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Calendar, Clock, User, Mail, Phone,
  MessageSquare, CreditCard, CheckCircle, Loader2, Shield, Copy, Check,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });

  const sessionDetails = {
    duration: '30 Minutes',
    price: 499,
    name: 'Career Guidance Session',
  };

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM',
  ];

  // Get next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          toast({
            title: 'Missing Information',
            description: 'Please fill in all required fields',
            variant: 'destructive',
          });
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast({
            title: 'Invalid Email',
            description: 'Please enter a valid email address',
            variant: 'destructive',
          });
          return false;
        }
        if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone.replace(/\s/g, ''))) {
          toast({
            title: 'Invalid Phone',
            description: 'Please enter a valid phone number',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.date || !formData.time) {
          toast({
            title: 'Missing Information',
            description: 'Please select date and time',
            variant: 'destructive',
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handlePayUPayment = async () => {
    const payuKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;
    
    if (!payuKey || payuKey === 'your_merchant_key') {
      toast({
        title: 'Payment Gateway Not Configured',
        description: 'Please use UPI QR Code option',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const bookingResponse = await fetch('/api/career-guidance/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentId: txnid,
          paymentMethod: 'payu_pending',
        }),
      });

      const bookingData = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Booking failed');
      }

      const paymentData = {
        key: payuKey,
        txnid: txnid,
        amount: sessionDetails.price.toString(),
        productinfo: sessionDetails.name,
        firstname: formData.name,
        email: formData.email,
        phone: formData.phone,
        surl: `${window.location.origin}/api/career-guidance/payu-callback?success=true&bookingId=${bookingData.bookingId}`,
        furl: `${window.location.origin}/api/career-guidance/payu-callback?success=false&bookingId=${bookingData.bookingId}`,
        udf1: bookingData.bookingId,
      };

      const hashResponse = await fetch('/api/career-guidance/payu-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const hashData = await hashResponse.json();

      if (!hashResponse.ok) {
        throw new Error('Failed to generate payment hash');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = process.env.NEXT_PUBLIC_PAYU_MODE === 'test' 
        ? 'https://test.payu.in/_payment'
        : 'https://secure.payu.in/_payment';

      const fields = {
        ...paymentData,
        hash: hashData.hash,
      };

      Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key as keyof typeof fields];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Payment Error',
        description: error.message || 'Please try UPI QR code option',
        variant: 'destructive',
      });
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/career-guidance/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod: 'upi_manual',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      router.push('/?payment=success');
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText('9573323563@ybl');
    setCopied(true);
    toast({ title: 'UPI ID Copied!', description: '9573323563@ybl' });
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { number: 1, title: 'Your Details', icon: User },
    { number: 2, title: 'Schedule', icon: Calendar },
    { number: 3, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0d14] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Book Your Career Guidance Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            30 minutes • ₹499 • 1-on-1 video call
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle size={24} />
                    ) : (
                      <step.icon size={24} />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.number
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 md:p-10">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Tell us about yourself
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Message (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about your career goals or specific topics you'd like to discuss..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Continue to Schedule
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Choose your preferred time
                </h2>

                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                      <select
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select a date</option>
                        {getAvailableDates().map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Time <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            formData.time === time
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Complete your payment
                </h2>

                {/* Booking Summary */}
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Session:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{sessionDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{sessionDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formData.time}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-300 dark:border-gray-600 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600">₹{sessionDetails.price}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4 mb-8">
                  {/* Online Payment */}
                  <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-600 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard size={24} className="text-blue-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">Pay Online (Recommended)</span>
                      </div>
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-semibold">Instant</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      UPI, Cards, Net Banking, Wallets - Instant confirmation
                    </p>
                    <button
                      onClick={handlePayUPayment}
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} />
                          Pay ₹{sessionDetails.price} Now
                        </>
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">OR</span>
                    </div>
                  </div>

                  {/* UPI QR Code */}
                  <div className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-semibold text-gray-900 dark:text-white">Pay via UPI QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Scan with any UPI app - Manual verification required
                    </p>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-48 h-48 bg-white rounded-xl mb-4 p-3 border border-gray-300">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9573323563@ybl%26pn=Saanvi%20Careers%26am=${sessionDetails.price}%26cu=INR%26tn=Career%20Guidance%20Session`}
                          alt="UPI Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                        <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                          9573323563@ybl
                        </span>
                        <button
                          onClick={copyUPI}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          {copied ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleManualPayment}
                        disabled={loading}
                        className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            I've Paid via UPI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trust line */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Shield size={16} />
                  <span>100% secure payment • Instant confirmation</span>
                </div>

                <button
                  onClick={handleBack}
                  className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
