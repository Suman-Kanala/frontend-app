'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Filter,
  MoreVertical,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  RefreshCw,
  ArrowUpDown,
  X,
  Eye
} from 'lucide-react';

interface JobFinderUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  skills: string[];
  countries: string[];
  resumeUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

type SortField = 'name' | 'email' | 'role' | 'experience' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function AdminUsers() {
  const { user: currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<JobFinderUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [filterResume, setFilterResume] = useState<'all' | 'with-resume' | 'without-resume'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.skills.some(skill => skill.toLowerCase().includes(query)) ||
        user.countries.some(country => country.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Verification filter
      if (filterVerified === 'verified' && !user.emailVerified) return false;
      if (filterVerified === 'unverified' && user.emailVerified) return false;

      // Resume filter
      if (filterResume === 'with-resume' && !user.resumeUrl) return false;
      if (filterResume === 'without-resume' && user.resumeUrl) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchQuery, sortField, sortDirection, filterVerified, filterResume]);

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredAndSortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Experience', 'Skills', 'Countries', 'Email Verified', 'Submitted Date'];
    const rows = filteredAndSortedUsers.map(user => [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.experience,
      user.skills.join('; '),
      user.countries.join('; '),
      user.emailVerified ? 'Yes' : 'No',
      new Date(user.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-finder-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[#635BFF] transition-colors group"
      aria-label={`Sort by ${field}`}
    >
      {children}
      <div className="flex flex-col">
        <ChevronUp 
          size={12} 
          className={`-mb-1 ${sortField === field && sortDirection === 'asc' ? 'text-[#635BFF]' : 'text-gray-300 group-hover:text-gray-400'}`} 
        />
        <ChevronDown 
          size={12} 
          className={`${sortField === field && sortDirection === 'desc' ? 'text-[#635BFF]' : 'text-gray-300 group-hover:text-gray-400'}`} 
        />
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#425466]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E3E8EF] sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#0A2540] tracking-tight">
                Admin Panel
              </h1>
              <p className="text-sm text-[#425466] mt-1">
                {filteredAndSortedUsers.length} of {users.length} job finder users
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                disabled={filteredAndSortedUsers.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#635BFF] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Export to CSV"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={fetchUsers}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E3E8EF] text-[#0A2540] text-sm font-medium rounded-lg hover:bg-[#F7FAFC] transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#6B7C95] uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-semibold text-[#0A2540] mt-1">{users.length}</p>
                </div>
                <Briefcase size={20} className="text-[#635BFF]" />
              </div>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#6B7C95] uppercase tracking-wide">Verified</p>
                  <p className="text-2xl font-semibold text-[#0A2540] mt-1">
                    {users.filter(u => u.emailVerified).length}
                  </p>
                </div>
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#6B7C95] uppercase tracking-wide">With Resume</p>
                  <p className="text-2xl font-semibold text-[#0A2540] mt-1">
                    {users.filter(u => u.resumeUrl).length}
                  </p>
                </div>
                <FileText size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#6B7C95] uppercase tracking-wide">With Phone</p>
                  <p className="text-2xl font-semibold text-[#0A2540] mt-1">
                    {users.filter(u => u.phone).length}
                  </p>
                </div>
                <Phone size={20} className="text-orange-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C95]" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E3E8EF] rounded-lg text-sm text-[#0A2540] placeholder-[#6B7C95] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
                aria-label="Search users"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-[#635BFF] text-white border-[#635BFF]' 
                  : 'bg-white text-[#425466] border-[#E3E8EF] hover:bg-[#F7FAFC]'
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-[#F7FAFC] border border-[#E3E8EF] rounded-lg">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7C95] uppercase tracking-wide mb-2">
                    Email Status
                  </label>
                  <select
                    value={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-[#E3E8EF] rounded-lg text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                    aria-label="Filter by email verification status"
                  >
                    <option value="all">All Users</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7C95] uppercase tracking-wide mb-2">
                    Resume Status
                  </label>
                  <select
                    value={filterResume}
                    onChange={(e) => setFilterResume(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-[#E3E8EF] rounded-lg text-sm text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                    aria-label="Filter by resume status"
                  >
                    <option value="all">All Users</option>
                    <option value="with-resume">With Resume</option>
                    <option value="without-resume">Without Resume</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterVerified('all');
                      setFilterResume('all');
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 text-sm text-[#425466] hover:text-[#0A2540] transition-colors"
                    aria-label="Clear all filters"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white border border-[#E3E8EF] rounded-lg overflow-hidden">
          {/* Table Header with Selection */}
          {selectedUsers.size > 0 && (
            <div className="px-6 py-3 bg-[#635BFF] text-white flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Scrollable Table */}
          <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
            <table className="w-full" role="table">
              <thead className="bg-[#F7FAFC] border-b border-[#E3E8EF] sticky top-0">
                <tr role="row">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[#635BFF] border-[#E3E8EF] rounded focus:ring-[#635BFF] focus:ring-2"
                      aria-label="Select all users"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    <SortButton field="name">User</SortButton>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    <SortButton field="email">Contact</SortButton>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    <SortButton field="role">Role</SortButton>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    Countries
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    <SortButton field="createdAt">Submitted</SortButton>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7C95] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8EF]" role="rowgroup">
                {filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Briefcase size={32} className="text-[#6B7C95] mb-3 opacity-50" />
                        <p className="text-sm text-[#425466] font-medium">No users found</p>
                        <p className="text-xs text-[#6B7C95] mt-1">
                          {searchQuery || showFilters ? 'Try adjusting your search or filters' : 'Users will appear here when they submit the job finder form'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-[#F7FAFC] transition-colors ${selectedUsers.has(user.id) ? 'bg-blue-50' : ''}`}
                      role="row"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 text-[#635BFF] border-[#E3E8EF] rounded focus:ring-[#635BFF] focus:ring-2"
                          aria-label={`Select ${user.name}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#635BFF] to-[#4F46E5] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#0A2540] truncate">{user.name}</p>
                            {user.emailVerified && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-xs text-emerald-600">Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-[#0A2540]">
                            <Mail size={12} className="text-[#6B7C95]" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-[#6B7C95]">
                              <Phone size={12} />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0A2540]">{user.role}</p>
                          <p className="text-xs text-[#6B7C95] mt-0.5">{user.experience}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 bg-[#F7FAFC] border border-[#E3E8EF] text-[#425466] text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 2 && (
                            <span className="text-xs text-[#6B7C95] px-1">
                              +{user.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {user.countries.slice(0, 2).map((country, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F7FAFC] border border-[#E3E8EF] text-[#425466] text-xs rounded"
                            >
                              <MapPin size={10} />
                              {country}
                            </span>
                          ))}
                          {user.countries.length > 2 && (
                            <span className="text-xs text-[#6B7C95] px-1">
                              +{user.countries.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {user.emailVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                              <CheckCircle2 size={10} />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                              Unverified
                            </span>
                          )}
                          {user.resumeUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                              <FileText size={10} />
                              Resume
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-[#6B7C95]">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.resumeUrl && (
                            <a
                              href={user.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] text-white text-xs font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
                              aria-label={`Download ${user.name}'s resume`}
                            >
                              <Download size={12} />
                              Resume
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}