'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Loader2, Trash2 } from 'lucide-react';
import {
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isLoading: loading, error } = useGetAdminUsersQuery({ page, limit: 20 });
  const [changeUserRoleMutation] = useChangeUserRoleMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const users = data?.users || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  async function changeRole(userId: string, currentRole: string, newRole: string): Promise<void> {
    if (currentRole === newRole) return;
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      await changeUserRoleMutation({ userId, role: newRole }).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
  }

  async function deleteUser(userId: string, userName: string): Promise<void> {
    if (!window.confirm(`Delete user "${userName}"? This action cannot be undone.`)) return;
    try {
      await deleteUserMutation(userId).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{total} total users</p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : error ? (
            <div className="flex justify-center py-20 text-red-500">{getErrorMessage(error, 'Failed to load users')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Joined</th>
                    <th className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {u.picture ? (
                            <img src={u.picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-gray-100">{u.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'instructor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2 items-center">
                          <select
                            value={u.role}
                            onChange={(e) => changeRole(u._id, u.role, e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 bg-white text-gray-700"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => deleteUser(u._id, u.name || u.email)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {pages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-sm rounded border disabled:opacity-40">Prev</button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm rounded border disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
