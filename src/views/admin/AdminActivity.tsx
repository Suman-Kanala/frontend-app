'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Search, Filter, Calendar, Users, Briefcase,
  Mail, Phone, MapPin, FileText, CheckCircle, X, ChevronDown,
  ExternalLink, Loader2, RefreshCw, TrendingUp,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  skills: string[];
  countries: string[];
  resumeUrl?: string;
  appliedJobs: Array<{
    title: string;
    company: string;
    location: string;
  }>;
  createdAt: string;
  emailVerified: boolean;
}

export default function AdminActivity() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApps, setFilteredApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredApps(applications);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredApps(
      applications.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q) ||
          app.phone.includes(q)
      )
    );
  }, [searchQuery, applications]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activity');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApplications(data.applications || []);
      setFilteredApps(data.applications || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function downloadReport() {
    setDownloading(true);
    try {
      // Generate CSV
      const headers = ['Name', 'Email', 'Phone', 'Role', 'Experience', 'Skills', 'Countries', 'Applied Jobs', 'Date', 'Email Verified'];
      const rows = filteredApps.map((app) => [
        app.name,
        app.email,
        app.phone,
        app.role,
        app.experience,
        app.skills.join('; '),
        app.countries.join('; '),
        app.appliedJobs.map((j) => `${j.title} at ${j.company}`).join('; '),
        new Date(app.createdAt).toLocaleDateString(),
        app.emailVerified ? 'Yes' : 'No',
      ]);

      const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: 'Downloaded!', description: 'Report exported successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download report', variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-[#635bff] animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#697386] dark:text-[#8898aa]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">
                Activity & Reports
              </h1>
              <p className="text-sm text-[#697386] dark:text-[#8898aa] mt-1">
                Job finder applications and user activity
              </p>
            </div>
            <button
              onClick={fetchApplications}
              className="p-2.5 rounded-xl border border-[#E6EBF1] dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-colors"
            >
              <RefreshCw size={18} className="text-[#697386] dark:text-[#8898aa]" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide">Total Applications</p>
                  <p className="text-3xl font-bold text-[#0a2540] dark:text-white mt-2">{applications.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#f0effe] dark:bg-[#635bff]/10 rounded-xl flex items-center justify-center">
                  <Users size={22} className="text-[#635bff]" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide">Verified Emails</p>
                  <p className="text-3xl font-bold text-[#0a2540] dark:text-white mt-2">
                    {applications.filter((a) => a.emailVerified).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle size={22} className="text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide">Total Jobs Applied</p>
                  <p className="text-3xl font-bold text-[#0a2540] dark:text-white mt-2">
                    {applications.reduce((sum, app) => sum + app.appliedJobs.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Briefcase size={22} className="text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#697386] dark:text-[#8898aa]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, role, or phone..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl text-sm text-[#0a2540] dark:text-white placeholder-[#697386] dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={downloadReport}
              disabled={downloading || filteredApps.length === 0}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#635bff]/20"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download Report
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl p-16 text-center">
            <Users size={48} className="text-[#E6EBF1] dark:text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0a2540] dark:text-white mb-2">No applications found</h3>
            <p className="text-sm text-[#697386] dark:text-[#8898aa]">
              {searchQuery ? 'Try adjusting your search' : 'Applications will appear here once users submit the job finder form'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E6EBF1] dark:border-white/[0.07]">
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Role & Experience
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Applied Jobs
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EBF1] dark:divide-white/[0.07]">
                  {filteredApps.map((app) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#F6F9FC] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#818cf8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {app.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0a2540] dark:text-white truncate">
                              {app.name}
                            </p>
                            {app.emailVerified && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <CheckCircle size={12} className="text-emerald-500" />
                                <span className="text-xs text-emerald-600 dark:text-emerald-400">Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#0a2540] dark:text-white">{app.role}</p>
                        <p className="text-xs text-[#697386] dark:text-[#8898aa] mt-0.5">{app.experience}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#697386] dark:text-[#8898aa]">
                            <Mail size={12} />
                            <span className="truncate max-w-[180px]">{app.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#697386] dark:text-[#8898aa]">
                            <Phone size={12} />
                            <span>{app.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#f0effe] dark:bg-[#635bff]/10 text-[#635bff] px-2 py-1 rounded-full">
                            <Briefcase size={11} />
                            {app.appliedJobs.length}
                          </span>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="text-xs text-[#635bff] hover:text-[#4f46e5] font-medium"
                          >
                            View
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-xs text-[#697386] dark:text-[#8898aa]">
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg border border-[#E6EBF1] dark:border-white/10 hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
                              title="View Resume"
                            >
                              <FileText size={14} className="text-[#697386] dark:text-[#8898aa]" />
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 rounded-lg border border-[#E6EBF1] dark:border-white/10 hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
                            title="View Details"
                          >
                            <ExternalLink size={14} className="text-[#697386] dark:text-[#8898aa]" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setSelectedApp(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50 bg-white dark:bg-[#0d1f33] rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6EBF1] dark:border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#635bff] to-[#818cf8] flex items-center justify-center text-white font-bold">
                    {selectedApp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0a2540] dark:text-white">{selectedApp.name}</h3>
                    <p className="text-sm text-[#697386] dark:text-[#8898aa]">{selectedApp.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-lg hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} className="text-[#697386] dark:text-[#8898aa]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-[#697386] dark:text-[#8898aa]" />
                        <span className="text-[#0a2540] dark:text-white">{selectedApp.email}</span>
                        {selectedApp.emailVerified && (
                          <CheckCircle size={14} className="text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-[#697386] dark:text-[#8898aa]" />
                        <span className="text-[#0a2540] dark:text-white">{selectedApp.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide mb-3">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center text-xs font-semibold bg-[#f0effe] dark:bg-[#635bff]/10 text-[#635bff] px-3 py-1.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Target Countries */}
                  <div>
                    <h4 className="text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide mb-3">
                      Target Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.countries.map((country) => (
                        <span
                          key={country}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#F6F9FC] dark:bg-white/5 text-[#0a2540] dark:text-white px-3 py-1.5 rounded-full border border-[#E6EBF1] dark:border-white/10"
                        >
                          <MapPin size={11} />
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Applied Jobs */}
                  <div>
                    <h4 className="text-xs font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wide mb-3">
                      Applied Jobs ({selectedApp.appliedJobs.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedApp.appliedJobs.map((job, i) => (
                        <div
                          key={i}
                          className="p-3 bg-[#F6F9FC] dark:bg-white/[0.03] border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl"
                        >
                          <p className="text-sm font-semibold text-[#0a2540] dark:text-white">{job.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#697386] dark:text-[#8898aa]">
                            <span className="flex items-center gap-1">
                              <Briefcase size={11} />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={11} />
                              {job.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume */}
                  {selectedApp.resumeUrl && (
                    <div>
                      <a
                        href={selectedApp.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        <FileText size={14} />
                        View Resume
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
