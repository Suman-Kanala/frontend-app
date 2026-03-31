'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Upload,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useUploadInterviewScreenshotMutation,
  useCreateInterviewBookingMutation,
  useSubmitInterviewProofMutation,
} from '@/store/api/appApi';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function InterviewSupport() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadScreenshot] = useUploadInterviewScreenshotMutation();
  const [createBooking] = useCreateInterviewBookingMutation();
  const [submitProof] = useSubmitInterviewProofMutation();

  // ── State ──
  const [currentStep, setCurrentStep] = useState<number>(1); // 1-4
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Step 1: Interview Details
  const [company, setCompany] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [screenshotKey, setScreenshotKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Step 2: Slot Booking
  const [slotDate, setSlotDate] = useState<string>('');
  const [slotTime, setSlotTime] = useState<string>('09:00');

  // Step 3: Experience
  const [experienceYears, setExperienceYears] = useState<string>('0');

  // Booking data
  const [bookingData, setBookingData] = useState<any>(null);

  // Step 4: Payment
  const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState<boolean>(false);
  const [proofKey, setProofKey] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sign-in?redirect_url=/interview-support');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const PRICE_TIERS = {
    0: 6000,
    1: 6000,
    2: 6000,
    3: 6000,
    4: 6000,
    5: 6000,
    6: 7000,
    7: 8000,
    8: 8000,
  };

  const getAmountFromExperience = (years) => PRICE_TIERS[parseInt(years, 10)];
  const amount = getAmountFromExperience(experienceYears);

  // ── File Handlers ──
  const handleScreenshotSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Screenshot must be less than 10MB');
      return;
    }

    // Clean up previous preview
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    setScreenshotFile(file);
    const preview = URL.createObjectURL(file);
    setScreenshotPreview(preview);
    setError(null);

    // Auto-upload screenshot
    await uploadScreenshotFile(file);
  };

  const uploadScreenshotFile = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading screenshot...');
      const result = await uploadScreenshot({ formData }).unwrap();
      console.log('Upload result:', result);
      console.log('Setting screenshotKey to:', result.key);
      setScreenshotKey(result.key);
      setError(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Failed to upload screenshot: ' + (err?.data?.error || err?.message || 'Unknown error'));
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } finally {
      setUploading(false);
    }
  };


  const handleProofSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Proof screenshot must be less than 10MB');
      return;
    }

    // Clean up previous preview
    if (proofPreview) {
      URL.revokeObjectURL(proofPreview);
    }

    setProofFile(file);
    const preview = URL.createObjectURL(file);
    setProofPreview(preview);
    setError(null);
  };

  const handleProofUpload = async () => {
    if (!proofFile) return;

    setProofUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', proofFile);

      const result = await uploadScreenshot({ formData }).unwrap();
      setProofKey(result.key);
      setError(null);
    } catch (err: any) {
      setError('Failed to upload proof: ' + (err?.data?.error || err?.message || 'Unknown error'));
    } finally {
      setProofUploading(false);
    }
  };

  // ── Step Handlers ──
  const handleNextStep = async () => {
    setError(null);

    if (currentStep === 1) {
      console.log('Step 1 validation - screenshotKey:', screenshotKey);
      if (!company.trim()) {
        setError('Company name is required');
        return;
      }
      if (!screenshotKey) {
        setError('Please upload a screenshot');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!slotDate) {
        setError('Please select a date');
        return;
      }
      // Validate date is not in the past
      const selected = new Date(slotDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        setError('Please select a date in the future');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
      // Create the booking
      await handleCreateBooking();
    }
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    setError(null);

    console.log('Creating booking with data:', {
      company: company.trim(),
      screenshotKey,
      jobDescription: jobDescription.trim() || null,
      slotDate: new Date(slotDate).toISOString(),
      slotTime,
      experienceYears: parseInt(experienceYears, 10),
    });

    try {
      const result = await createBooking({
        company: company.trim(),
        screenshotKey,
        jobDescription: jobDescription.trim() || null,
        slotDate: new Date(slotDate).toISOString(),
        slotTime,
        experienceYears: parseInt(experienceYears, 10),
      }).unwrap();

      setBookingData(result);
    } catch (err: any) {
      setError('Failed to create booking: ' + (err?.data?.error || err?.message || 'Unknown error'));
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!upiTransactionId.trim()) {
      setError('UPI Transaction ID is required');
      return;
    }
    if (!proofKey) {
      setError('Please upload payment proof');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitProof({
        bookingId: bookingData.booking._id,
        upiTransactionId: upiTransactionId.trim(),
        proofKey,
      }).unwrap();

      // Show success state
      setCurrentStep(5);
    } catch (err: any) {
      setError('Failed to submit proof: ' + (err?.data?.error || err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date();
  const minDateString = today.toISOString().split('T')[0];

  // 24-hour slots (00:00 to 23:00)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${String(i).padStart(2, '0')}:00`;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Interview Support Coaching
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get expert guidance for your upcoming interviews
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Details</span>
            <span>Slot</span>
            <span>Experience</span>
            <span>Payment</span>
            <span>Done</span>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}

        {/* Step 1: Interview Details */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            {...fadeUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interview Details
            </h2>

            {/* Company Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Microsoft, Amazon"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Screenshot Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Scheduled Screenshot *
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Upload a screenshot of the job description you're preparing for
              </p>

              {screenshotKey ? (
                <div>
                  {screenshotPreview && (
                    <div className="mb-4 relative">
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => {
                          if (screenshotPreview) {
                            URL.revokeObjectURL(screenshotPreview);
                          }
                          setScreenshotFile(null);
                          setScreenshotPreview(null);
                          setScreenshotKey(null);
                          // Reset file input to allow re-uploading same file
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-200">
                        Screenshot uploaded successfully
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Ready for next step
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-gray-600 dark:text-gray-300">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Click to upload screenshot
                      </span>
                    </>
                  )}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotSelect}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description (Optional)
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Share any additional details about the role
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or key responsibilities..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextStep}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Continue to Slot Booking
            </button>
          </motion.div>
        )}

        {/* Step 2: Slot Booking */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            {...fadeUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Book Your Interview Slot
            </h2>

            {/* Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Date *
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Select your preferred interview date
              </p>
              <div className="relative">
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  min={minDateString}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-medium"
                  style={{ colorScheme: 'light dark' }}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Time *
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Available 24/7 - Choose any time that works for you
              </p>
              <div className="relative">
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-medium appearance-none"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time} IST
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Preview */}
            {slotDate && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Selected: {new Date(slotDate).toLocaleDateString('en-IN')} at {slotTime} IST
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Continue to Experience
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Experience */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            {...fadeUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Select Your Experience Level
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Choose your current experience level:
            </p>

            {/* Experience Options - No Pricing */}
            <div className="space-y-3 mb-8">
              {[
                { years: '0', label: '0-5 years' },
                { years: '6', label: '6-7 years' },
                { years: '7', label: '7-8 years' },
              ].map(({ years, label }) => (
                <button
                  key={years}
                  onClick={() => setExperienceYears(years)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center justify-start ${
                    experienceYears === years
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <p className={`font-medium ${experienceYears === years ? 'text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}>
                    {label}
                  </p>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && bookingData && (
          <motion.div
            key="step4"
            {...fadeUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Payment
            </h2>

            {/* Booking Summary */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Company:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Interview Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(slotDate).toLocaleDateString('en-IN')} at {slotTime}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <span className="text-gray-600 dark:text-gray-400">Session Fee:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Scan QR code to pay via UPI:
              </p>
              {bookingData.qrDataUrl && (
                <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={bookingData.qrDataUrl}
                    alt="UPI QR Code"
                    className="w-64 h-64 mb-4"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Use any UPI app (Google Pay, PhonePe, etc.) to scan and pay
                  </p>
                </div>
              )}
            </div>

            {/* UPI Link */}
            {bookingData.upiLink && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or copy UPI link:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bookingData.upiLink}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(bookingData.upiLink)}
                    className="px-4 py-3 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ Copied to clipboard
                  </p>
                )}
              </div>
            )}

            {/* Transaction ID & Proof */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                UPI Transaction ID *
              </label>
              <input
                type="text"
                value={upiTransactionId}
                onChange={(e) => setUpiTransactionId(e.target.value)}
                placeholder="e.g., UPI1234567890"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Proof Screenshot */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Proof Screenshot *
              </label>

              {proofPreview && (
                <div className="mb-4 relative">
                  <img
                    src={proofPreview}
                    alt="Proof Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={() => {
                      if (proofPreview) {
                        URL.revokeObjectURL(proofPreview);
                      }
                      setProofFile(null);
                      setProofPreview(null);
                      setProofKey(null);
                      // Reset file input to allow re-uploading same file
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}

              {proofKey ? (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-200">
                      Proof uploaded successfully
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {proofFile ? proofFile.name : 'Click to upload proof'}
                    </span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProofSelect}
                    className="hidden"
                  />

                  {proofFile && (
                    <button
                      onClick={handleProofUpload}
                      disabled={proofUploading}
                      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {proofUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload Proof
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitProof}
              disabled={loading || !upiTransactionId.trim() || !proofKey}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Payment & Booking
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            {...fadeUp}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Submitted Successfully!
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your interview support booking has been submitted for verification. You'll receive a confirmation email shortly.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What Happens Next:</h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>Our team verifies your payment (usually within 24 hours)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>You'll receive a confirmation email with interview details</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>
                    Your coach will contact you 24 hours before the session
                  </span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
