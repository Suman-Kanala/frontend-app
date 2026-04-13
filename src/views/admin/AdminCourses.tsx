'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Video, X, Loader2 } from 'lucide-react';
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetAdminCoursesQuery,
  useUpdateCourseMutation,
} from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyForm = { title: '', slug: '', description: '', price: '', discountPrice: '', upiId: '', thumbnail: '' };

export default function AdminCourses() {
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { data: courses = [], isLoading: loading, error } = useGetAdminCoursesQuery(undefined);
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(c: any): void {
    setEditId(c._id);
    setForm({
      title: c.title || '',
      slug: c.slug || '',
      description: c.description || '',
      price: c.price ?? '',
      discountPrice: c.discountPrice ?? '',
      upiId: c.upiId || '',
      thumbnail: c.thumbnail || '',
    });
    setShowForm(true);
  }

  async function handleSave(e: any): Promise<void> {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        price: Number(form.price) || 0,
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      };
      if (editId) {
        await updateCourse({ id: editId, ...payload }).unwrap();
      } else {
        await createCourse(payload).unwrap();
      }
      setShowForm(false);
    } catch (err: any) { alert(getErrorMessage(err)); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!window.confirm('Delete this course and all its videos?')) return;
    setDeleting(id);
    try {
      await deleteCourse(id).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
    finally { setDeleting(null); }
  }

  async function togglePublish(c: any): Promise<void> {
    try {
      await updateCourse({ id: c._id, isPublished: !c.isPublished }).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
  }

  function setField(field: string, value: any): void {
    setForm((f: any) => {
      const next = { ...f, [field]: value };
      if (field === 'title' && !editId) next.slug = slugify(value);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage courses</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2540] hover:bg-[#0d3058] dark:bg-[#0a2540] dark:hover:bg-[#0d3058] text-white rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" /> Create Course
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#635bff] dark:text-[#7a73ff]" /></div>
        ) : error ? (
          <div className="text-center py-24 border border-dashed border-red-300 dark:border-red-700 rounded-xl bg-red-50/50 dark:bg-red-900/10 text-red-500">
            {getErrorMessage(error, 'Failed to load courses')}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-400">No courses yet. Create your first course!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((c: any) => (
              <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 p-5 flex items-center gap-4 flex-wrap transition-colors">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0a2540] to-[#635bff] dark:from-[#0a2540] dark:to-[#635bff]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ₹{c.price}{c.discountPrice ? ` → ₹${c.discountPrice}` : ''} ·
                    <span className={`ml-2 px-2 py-1 text-xs rounded font-medium ${c.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => router.push(`/admin/courses/${c._id}/videos`)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#f0effe] dark:bg-[#f0effe]/10 text-[#635bff] dark:text-[#7a73ff] rounded-lg hover:bg-[#f0effe]/70 dark:hover:bg-[#f0effe]/20 transition-colors">
                    <Video className="w-4 h-4" /> Videos
                  </button>
                  <button onClick={() => togglePublish(c)} className={`p-2 rounded-lg transition-colors ${c.isPublished ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`} title={c.isPublished ? 'Unpublish' : 'Publish'}>
                    {c.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(c)} className="p-2 text-[#635bff] dark:text-[#7a73ff] bg-[#f0effe] dark:bg-[#f0effe]/10 rounded-lg hover:bg-[#f0effe]/70 dark:hover:bg-[#f0effe]/20 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editId ? 'Edit Course' : 'Create Course'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Title *</label>
                <input value={form.title} onChange={e => setField('title', e.target.value)} required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#635bff] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Slug</label>
                <input value={form.slug} onChange={e => setField('slug', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={4} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#635bff] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Price (₹) *</label>
                  <input type="number" min="0" step="1" value={form.price} onChange={e => setField('price', e.target.value)} required className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Discount Price (₹)</label>
                  <input type="number" min="0" step="1" value={form.discountPrice} onChange={e => setField('discountPrice', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input value={form.upiId} onChange={e => setField('upiId', e.target.value)} placeholder="merchant@upi" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input value={form.thumbnail} onChange={e => setField('thumbnail', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#0a2540] text-white py-2.5 rounded-xl font-medium hover:bg-[#0d3058] disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
