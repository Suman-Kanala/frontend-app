'use client';

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle,
  Copy,
  Upload,
  AlertCircle,
  Clock,
  ArrowLeft,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInitiatePaymentMutation,
  useSubmitPaymentProofMutation,
  useUploadProofMutation,
} from "@/store/api/appApi";
import { getErrorMessage } from "@/store/api/baseQuery";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Payment() {
  const { courseId } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initiatePayment] = useInitiatePaymentMutation();
  const [uploadProof] = useUploadProofMutation();
  const [submitPaymentProof] = useSubmitPaymentProofMutation();

  // ── State ──
  const [state, setState] = useState<string>("loading"); // loading | showQR | uploadingProof | submitted
  const [error, setError] = useState<string | null>(null);

  // Payment initiation data
  const [paymentData, setPaymentData] = useState<any>(null);

  // Proof submission fields
  const [upiTransactionId, setUpiTransactionId] = useState<string>("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Copy‐to‐clipboard feedback
  const [copied, setCopied] = useState(false);

  // ── Redirect to login if not authenticated ──
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      login();
    }
  }, [authLoading, isAuthenticated, login]);

  // ── Initiate payment on mount ──
  useEffect(() => {
    if (!isAuthenticated || !courseId) return;

    let cancelled = false;

    async function initiate() {
      try {
        setState("loading");
        setError(null);
        const data = await initiatePayment(courseId).unwrap();
        if (!cancelled) {
          setPaymentData(data);
          setState("showQR");
        }
      } catch (err: any) {
        if (!cancelled) {
          const msg = getErrorMessage(err, "");
          // Already enrolled → redirect to the course
          if (msg.toLowerCase().includes("already enrolled")) {
            router.replace(`/courses/${courseId}`);
            return;
          }
          setError(msg || "Failed to initiate payment. Please try again.");
          setState("showQR");
        }
      }
    }

    initiate();
    return () => { cancelled = true; };
  }, [isAuthenticated, courseId]);

  // ── File selection handler ──
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, etc.).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Screenshot must be under 10 MB.");
      return;
    }

    setError(null);
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string | null);
    reader.readAsDataURL(file);
  }

  // ── Copy UPI link to clipboard ──
  function handleCopyUpi() {
    if (!paymentData?.upiLink) return;
    try {
      // Use textarea method to avoid permission popups
      const ta = document.createElement("textarea");
      ta.value = paymentData.upiLink;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      console.error("Copy to clipboard failed:", err);
    }
  }

  // ── Submit payment proof ──
  async function handleSubmitProof(e) {
    e.preventDefault();
    setError(null);

    if (!upiTransactionId.trim()) {
      setError("Please enter the UPI Transaction ID.");
      return;
    }
    if (!screenshotFile) {
      setError("Please upload a screenshot of your payment.");
      return;
    }

    try {
      setState("uploadingProof");

      const formData = new FormData();
      formData.append('file', screenshotFile);
      const uploadRes = await uploadProof({ formData }).unwrap();

      await submitPaymentProof({
        paymentId: paymentData.payment?._id || paymentData.paymentId,
        upiTransactionId: upiTransactionId.trim(),
        proofKey: uploadRes.key,
      }).unwrap();

      setState("submitted");
    } catch (err: any) {
      setError(getErrorMessage(err, "Failed to submit payment proof. Please try again."));
      setState("showQR");
    }
  }

  // ── Loading / auth gate ──
  if (authLoading || (state === "loading" && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F9FC] via-[#f0effe]/20 to-[#F6F9FC]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 text-[#635bff] animate-spin" />
          <p className="text-gray-600 font-medium">Preparing your payment...</p>
        </motion.div>
      </div>
    );
  }

  // ── Submitted state ──
  if (state === "submitted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F9FC] via-[#f0effe]/20 to-[#F6F9FC] px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Payment Submitted!
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Payment submitted for verification. You'll get access once admin verifies.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium text-sm mb-8">
            <Clock className="w-4 h-4" />
            Pending Verification
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0a2540] hover:bg-[#0d3058] text-white rounded-lg font-medium transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="inline-flex items-center gap-2 text-[#635bff] hover:text-[#7a73ff] font-medium transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main payment flow (showQR / uploadingProof) ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] via-[#f0effe]/20 to-[#F6F9FC] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0a2540] to-[#635bff] bg-clip-text text-transparent">
            Complete Your Payment
          </h1>
          <p className="mt-2 text-gray-500">
            Scan the QR code or use the UPI link below
          </p>
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </motion.div>
        )}

        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Course & Amount info */}
            <div className="bg-[#0a2540] px-6 py-5 text-white">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wide">
                    Course
                  </p>
                  <h2 className="text-xl font-bold mt-0.5">
                    {paymentData.courseName || paymentData.payment?.courseId?.title || "Course Enrollment"}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wide">
                    Amount
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {(paymentData.payment?.amount ?? paymentData.amount) != null
                        ? Number(paymentData.payment?.amount ?? paymentData.amount).toLocaleString("en-IN")
                        : "--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code section */}
            <div className="p-6 md:p-8">
              {/* QR code */}
              {paymentData.qrDataUrl && (
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-white p-3 rounded-xl border-2 border-dashed border-[#635bff]/20 shadow-sm">
                    <img
                      src={paymentData.qrDataUrl}
                      alt="UPI QR Code"
                      className="w-56 h-56 md:w-64 md:h-64 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                  </p>
                </div>
              )}

              {/* UPI Link */}
              {paymentData.upiLink && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI Link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 font-mono truncate select-all">
                      {paymentData.upiLink}
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f0effe] hover:bg-[#f0effe]/80 text-[#635bff] border border-[#635bff]/20 rounded-lg text-sm font-medium transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                    After payment, submit proof below
                  </span>
                </div>
              </div>

              {/* Proof form */}
              <form onSubmit={handleSubmitProof} className="space-y-5">
                {/* UPI Transaction ID */}
                <div>
                  <label
                    htmlFor="upiTransactionId"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    UPI Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="upiTransactionId"
                    type="text"
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    placeholder="e.g. 412345678901"
                    disabled={state === "uploadingProof"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] disabled:bg-gray-100 disabled:cursor-not-allowed transition-shadow"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    You can find this in your UPI app's transaction history.
                  </p>
                </div>

                {/* Screenshot upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={state === "uploadingProof"}
                    className="hidden"
                  />

                  {screenshotPreview ? (
                    <div className="relative group">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot preview"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotFile(null);
                          setScreenshotPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        disabled={state === "uploadingProof"}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-1.5 shadow transition-colors"
                        aria-label="Remove screenshot"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={state === "uploadingProof"}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-[#635bff]/40 rounded-lg py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-[#635bff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">
                        Click to upload screenshot
                      </span>
                      <span className="text-xs text-gray-400">
                        JPG, PNG, WEBP up to 10 MB
                      </span>
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={state === "uploadingProof"}
                  className="w-full flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3058] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-[#0a2540]/20 hover:shadow-[#0a2540]/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === "uploadingProof" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Submit Payment Proof
                    </>
                  )}
                </button>
              </form>

              {/* Security note */}
              <p className="text-center text-xs text-gray-400 mt-5">
                <ShieldCheck className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Your payment details are encrypted and securely transmitted.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
