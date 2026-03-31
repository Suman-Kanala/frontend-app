'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, BookOpen, CreditCard, DollarSign, AlertCircle, CheckCircle, XCircle, Eye, Briefcase, Activity } from 'lucide-react';
import {
  useGetAdminStatsQuery,
  useGetPendingPaymentsQuery,
  useGetPendingInterviewCountQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
} from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } } as const;

function StatCard({ icon: Icon, label, value, color, onClick }: { icon: any; label: string; value: string | number; color: string; onClick?: () => void }): JSX.Element {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetAdminStatsQuery(undefined);
  const {
    data: pendingPaymentsData = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPendingPaymentsQuery(undefined);
  const {
    data: pendingInterviewData,
    isLoading: interviewCountLoading,
  } = useGetPendingInterviewCountQuery(undefined);
  const [verifyPayment] = useVerifyPaymentMutation();
  const [rejectPayment] = useRejectPaymentMutation();
  const pendingPayments = Array.isArray(pendingPaymentsData) ? pendingPaymentsData.slice(0, 5) : [];
  const pendingInterviewCount = pendingInterviewData?.count || 0;
  const loading = statsLoading || paymentsLoading || interviewCountLoading;
  const error = statsError || paymentsError;

  async function handleVerify(paymentId: string): Promise<void> {
    setActionLoading(paymentId);
    try {
      await verifyPayment(paymentId).unwrap();
    } catch (err: any) {
      alert('Verify failed: ' + getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(paymentId: string): Promise<void> {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    setActionLoading(paymentId);
    try {
      await rejectPayment({ paymentId, reason }).unwrap();
    } catch (err: any) {
      alert('Reject failed: ' + getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-500 text-lg font-medium mb-4">{getErrorMessage(error, 'Failed to load admin dashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div {...fadeUp} className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage courses, payments, and users</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalCourses || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalEnrollments || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            onClick={() => router.push('/admin/payments')}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.pendingPayments || 0}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} className="mb-12 flex flex-wrap gap-3">
          <button onClick={() => router.push('/admin/courses')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Manage Courses
          </button>
          <button onClick={() => router.push('/admin/payments')} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Verify Payments
          </button>
          <button onClick={() => router.push('/admin/interview-support')} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Interview Support
            {pendingInterviewCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">
                {pendingInterviewCount}
              </span>
            )}
          </button>
          <button onClick={() => router.push('/admin/users')} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">
            Manage Users
          </button>
          <button onClick={() => router.push('/admin/monitoring')} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitoring
          </button>
        </motion.div>

        {/* Pending Payments */}
        <motion.div {...fadeUp} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
            {pendingPayments.length > 0 && (
              <button onClick={() => router.push('/admin/payments')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            )}
          </div>

          {pendingPayments.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">No pending payments</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingPayments.map((p) => (
                <div key={p._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-gray-900 dark:text-white">{p.userId?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{p.courseId?.title || 'Unknown Course'} — ₹{p.amount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {p.upiTransactionId && `TXN: ${p.upiTransactionId} · `}
                      {new Date(p.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  {p.proofUrl && (
                    <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      <Eye className="w-4 h-4" /> View Proof
                    </a>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleVerify(p._id)}
                      disabled={actionLoading === p._id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Verify
                    </button>
                    <button
                      onClick={() => handleReject(p._id)}
                      disabled={actionLoading === p._id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
