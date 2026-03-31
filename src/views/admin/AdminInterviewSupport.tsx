'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  useGetAdminInterviewBookingsQuery,
  useApproveInterviewBookingMutation,
  useRejectInterviewBookingMutation,
} from '@/store/api/appApi';

const statusBadgeColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
    case 'approved':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
};

const paymentStatusBadge = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    case 'submitted':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
    case 'verified':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    case 'rejected':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
};

export default function AdminInterviewSupport() {
  const [tab, setTab] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState<string | null>(null); // 'screenshot', 'proof', or null
  const [rejectReason, setRejectReason] = useState<string>('');

  const [approveBooking, { isLoading: approveLoading }] = useApproveInterviewBookingMutation();
  const [rejectBooking, { isLoading: rejectLoading }] = useRejectInterviewBookingMutation();

  // Determine filter based on tab
  const statusFilter = tab === 'all' ? null : tab;
  const { data, isLoading, error } = useGetAdminInterviewBookingsQuery({
    status: statusFilter,
    page,
    limit: 15,
  });

  const bookings = data?.bookings || [];
  const totalPages = data?.pages || 1;

  // Filter by search query (client-side)
  const filteredBookings = bookings.filter(
    (booking: any) =>
      booking.userId.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (bookingId: string): Promise<void> => {
    try {
      await approveBooking(bookingId).unwrap();
      setSelectedBooking(null);
      setShowModal(null);
    } catch (err: any) {
      alert('Failed to approve: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  const handleReject = async (bookingId: string): Promise<void> => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await rejectBooking({ bookingId, reason: rejectReason.trim() }).unwrap();
      setSelectedBooking(null);
      setShowModal(null);
      setRejectReason('');
    } catch (err: any) {
      alert('Failed to reject: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Interview Support Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Review and approve interview support bookings
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or company..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-4 border-b border-gray-300 dark:border-gray-700"
        >
          {['all', 'pending', 'approved', 'rejected'].map((tabName) => (
            <button
              key={tabName}
              onClick={() => {
                setTab(tabName);
                setPage(1);
              }}
              className={`px-6 py-3 font-medium transition-colors capitalize border-b-2 ${
                tab === tabName
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tabName}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-200">
              Failed to load bookings: {(error as any)?.data?.error || 'Unknown error'}
            </p>
          </motion.div>
        )}

        {/* Bookings List */}
        {!isLoading && filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400">
              No bookings found in this category
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredBookings.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* User Info */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Student
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.userId.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {booking.userId.email}
                    </p>
                  </div>

                  {/* Company */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Company
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.company}
                    </p>
                  </div>

                  {/* Interview Date & Time */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Interview Slot
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(booking.slotDate).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {booking.slotTime} IST
                    </p>
                  </div>

                  {/* Status & Amount */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
                      Status
                    </p>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border w-fit ${statusBadgeColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        ₹{booking.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Payment Status
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentStatusBadge(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {booking.screenshotUrl && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal('screenshot');
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View JD Screenshot
                    </button>
                  )}

                  {booking.proofUrl && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal('proof');
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Proof
                    </button>
                  )}

                  {booking.status === 'pending' && booking.paymentStatus === 'submitted' && (
                    <>
                      <button
                        onClick={() => handleApprove(booking._id)}
                        disabled={approveLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white transition-colors text-sm font-medium"
                      >
                        {approveLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal('reject');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center gap-2"
          >
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
              .map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span className="px-2 text-gray-600 dark:text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Screenshot Modal */}
      {showModal === 'screenshot' && selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setShowModal(null);
            setSelectedBooking(null);
          }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Description Screenshot
              </h3>
              <button
                onClick={() => {
                  setShowModal(null);
                  setSelectedBooking(null);
                }}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedBooking.screenshotUrl ? (
                <img
                  src={selectedBooking.screenshotUrl}
                  alt="Job Description"
                  className="w-full rounded-lg"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Screenshot not available
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Proof Modal */}
      {showModal === 'proof' && selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setShowModal(null);
            setSelectedBooking(null);
          }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Proof
              </h3>
              <button
                onClick={() => {
                  setShowModal(null);
                  setSelectedBooking(null);
                }}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedBooking.proofUrl ? (
                <img
                  src={selectedBooking.proofUrl}
                  alt="Payment Proof"
                  className="w-full rounded-lg"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Proof not available
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reject Modal */}
      {showModal === 'reject' && selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setShowModal(null);
            setRejectReason('');
          }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reject Booking
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Provide a reason for rejecting this booking:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Invalid payment proof, Duplicate booking, etc."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedBooking._id)}
                disabled={rejectLoading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {rejectLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Reject'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
