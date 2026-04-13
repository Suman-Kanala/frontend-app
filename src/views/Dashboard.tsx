'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetMyEnrollmentsQuery,
  useGetMyPaymentsQuery,
  useGetMyInterviewBookingsQuery,
} from "@/store/api/appApi";
import { getErrorMessage } from "@/store/api/baseQuery";

/* ── Animation variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

/* ── Helpers ── */
function statusBadge(status) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    verified: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };
  return map[status] || "bg-gray-100 text-gray-700 border-gray-300";
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Loading Spinner ── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#635bff]/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#635bff]" />
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center backdrop-blur">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0effe] dark:bg-[#635bff]/15/40">
        <Icon className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Dashboard Component
   ══════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useGetMyEnrollmentsQuery(undefined);
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetMyPaymentsQuery(undefined);
  const {
    data: interviewData,
    isLoading: interviewLoading,
  } = useGetMyInterviewBookingsQuery(undefined);
  const interviews = interviewData?.bookings || [];
  const loading = enrollmentsLoading || paymentsLoading || interviewLoading;
  const error = enrollmentsError || paymentsError;

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/40">
        <div className="text-center px-6">
          <p className="text-red-500 text-lg font-medium mb-4">{getErrorMessage(error, "Failed to load dashboard data")}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Welcome Header ── */}
        <motion.div {...fadeUp} className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || "Profile"}
                className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0a2540] text-xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome back, {user?.name || "Student"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening in your learning journey
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{enrollments.length}</p>
              </div>
              <div className="h-12 w-12 bg-[#f0effe] dark:bg-[#635bff]/15 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#635bff] dark:text-[#7a73ff]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{payments.length}</p>
              </div>
              <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {enrollments.filter((e) => (e.progress?.percentComplete || 0) >= 100).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Enrolled Courses ── */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            My Courses
          </h2>

          {enrollments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No courses yet</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Start learning by enrolling in your first course</p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {enrollments.map((enrollment) => {
                const course = enrollment.courseId || enrollment.course || {};
                const percent = Math.min(
                  Math.round(enrollment.progress?.percentComplete || 0),
                  100
                );

                return (
                  <motion.div
                    key={enrollment._id}
                    variants={fadeUp}
                    onClick={() => router.push(`/courses/${course.slug || course._id || ""}`)}
                    className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title || "Course"}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#f0effe] dark:bg-[#635bff]/10">
                          <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      <span className="absolute right-3 top-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-1 rounded-lg text-xs font-semibold">
                        {percent}%
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-white mb-3">
                        {course.title || "Untitled Course"}
                      </h3>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">{percent}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full bg-[#635bff] dark:bg-[#7a73ff] transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/courses/${course.slug || course._id || ""}`);
                        }}
                        className="w-full rounded-lg bg-[#0a2540] hover:bg-[#0d3058] dark:bg-blue-600 dark:hover:bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition-colors"
                      >
                        {percent >= 100 ? "Review Course" : "Continue Learning"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.section>

        {/* ── Payment History ── */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Payment History
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No payments yet</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Course</th>
                      <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Amount</th>
                      <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Status</th>
                      <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, idx) => {
                      const course = payment.courseId || payment.course || {};
                      return (
                        <tr
                          key={payment._id || idx}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors last:border-0"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{course.title || "—"}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {payment.amount != null ? `₹${Number(payment.amount).toLocaleString("en-IN")}` : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-lg px-3 py-1 text-xs font-semibold capitalize ${statusBadge(payment.status)}`}>
                              {payment.status || "unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(payment.createdAt || payment.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.section>

        {/* ── Interview Support Section ── */}
        {interviews.length > 0 && (
          <motion.section {...fadeUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interview Support Bookings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <motion.div
                  key={interview._id}
                  variants={fadeUp}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {interview.company}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(interview.slotDate).toLocaleDateString("en-IN")} at{" "}
                        {interview.slotTime}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{interview.amount.toLocaleString("en-IN")}</p>
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-xs font-semibold capitalize ${
                        interview.status === "approved"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : interview.status === "rejected"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div {...fadeUp} className="text-center mt-6">
              <button
                onClick={() => router.push("/interview-support")}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-2 text-sm font-semibold text-white transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Book Another Session
              </button>
            </motion.div>
          </motion.section>
        )}

        {/* ── Browse More Button ── */}
        <motion.div {...fadeUp} className="text-center">
          <button
            onClick={() => router.push("/courses")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0a2540] hover:bg-[#0d3058] dark:bg-blue-600 dark:hover:bg-blue-700 px-8 py-3 text-base font-semibold text-white transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            Browse More Courses
          </button>
        </motion.div>
      </div>
    </div>
  );
}
