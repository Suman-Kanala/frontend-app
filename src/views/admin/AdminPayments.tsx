'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, X, Loader2 } from 'lucide-react';
import {
  useGetAdminPaymentsQuery,
  useRejectPaymentMutation,
  useVerifyPaymentMutation,
} from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

const tabs = ['all', 'pending', 'verified', 'rejected'];

export default function AdminPayments() {
  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofModal, setProofModal] = useState<any>(null);
  const {
    data,
    isLoading: loading,
    error,
  } = useGetAdminPaymentsQuery({ status: activeTab, page, limit: 15 });
  const [verifyPayment] = useVerifyPaymentMutation();
  const [rejectPayment] = useRejectPaymentMutation();
  const payments = data?.payments || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  function changeTab(t: string): void { setActiveTab(t); setPage(1); }

  async function handleVerify(id: string): Promise<void> {
    setActionLoading(id);
    try {
      await verifyPayment(id).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  }

  async function handleReject(id: string): Promise<void> {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    setActionLoading(id);
    try {
      await rejectPayment({ paymentId: id, reason }).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-800', verified: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Management</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => changeTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">{getErrorMessage(error, 'Failed to load payments')}</div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center text-gray-400">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-5 py-3 font-semibold text-gray-700">User</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Course</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Amount</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">TXN ID</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Status</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Date</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.map((p: any) => (
                    <tr key={p._id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{p.userId?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{p.userId?.email || ''}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{p.courseId?.title || '—'}</td>
                      <td className="px-5 py-3 text-gray-700">₹{p.amount}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs font-mono">{p.upiTransactionId || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[p.status as keyof typeof statusColor] || 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {(p.proofUrl || p.proofScreenshot) && (
                            <button onClick={() => setProofModal(p.proofUrl || p.proofScreenshot)} className="text-blue-600 hover:text-blue-800" title="View proof">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {p.status === 'pending' && (
                            <>
                              <button onClick={() => handleVerify(p._id)} disabled={actionLoading === p._id} className="text-green-600 hover:text-green-800 disabled:opacity-50" title="Verify">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleReject(p._id)} disabled={actionLoading === p._id} className="text-red-600 hover:text-red-800 disabled:opacity-50" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">{total} total payments</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm rounded border disabled:opacity-40">Prev</button>
                <span className="px-3 py-1 text-sm text-gray-600">{page}/{pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm rounded border disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof Modal */}
      {proofModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setProofModal(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setProofModal(null)} className="absolute top-3 right-3 bg-gray-100 rounded-full p-1 hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
            <img src={proofModal} alt="Payment proof" className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
