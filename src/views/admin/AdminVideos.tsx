'use client';

import React, { useMemo, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Trash2, Edit, X, Loader2, ArrowLeft, Eye, GripVertical } from 'lucide-react';
import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useGetAdminCoursesQuery,
  useGetCourseVideosQuery,
  useUpdateVideoMutation,
  useUploadVideoMutation,
} from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

interface Video {
  _id: string;
  title?: string;
  description?: string;
  order?: number;
  duration?: number;
  isPreview?: boolean;
  [key: string]: any;
}

interface VideoForm {
  title: string;
  description: string;
  order: string | number;
  duration: string | number;
  isPreview: boolean;
}

const emptyVideoForm: VideoForm = { title: '', description: '', order: '', duration: '', isPreview: false };

export default function AdminVideos() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : Array.isArray(params.courseId) ? params.courseId[0] : undefined;
  const router = useRouter();

  // Upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState(emptyVideoForm);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyVideoForm);
  const [saving, setSaving] = useState(false);
  const {
    data: adminCourses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetAdminCoursesQuery(undefined);
  const {
    data: videos = [],
    isLoading: videosLoading,
    error: videosError,
    refetch: refetchVideos,
  } = useGetCourseVideosQuery(courseId as string, { skip: !courseId });
  const [uploadVideo] = useUploadVideoMutation();
  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const course = useMemo(
    () => adminCourses.find((entry: any) => entry._id === courseId) || null,
    [adminCourses, courseId]
  );
  const loading = coursesLoading || videosLoading || !courseId;
  const error = coursesError || videosError;

  async function handleUpload(e: any): Promise<void> {
    e.preventDefault();
    if (!videoFile) { alert('Please select a video file'); return; }

    // Validate file size (10GB max)
    const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
    if (videoFile.size > MAX_UPLOAD_SIZE) {
      const sizeMB = Math.round(videoFile.size / (1024 * 1024));
      const maxMB = Math.round(MAX_UPLOAD_SIZE / (1024 * 1024));
      alert(`File too large! Your video is ${sizeMB}MB, but max allowed is ${maxMB}MB (10GB).`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', videoFile);

      const uploadResult = await uploadVideo({
        formData,
        courseId: String(courseId),
        onUploadProgress: (evt: ProgressEvent) => {
          if (evt.lengthComputable) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      }).unwrap();

      const storageKey = uploadResult?.key || uploadResult?.public_id;
      if (!storageKey) {
        throw new Error('Upload succeeded but no S3 storage key was returned.');
      }

      await createVideo({
        courseId,
        title: uploadForm.title || videoFile.name.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '').replace(/\b\w/g, c => c.toUpperCase()).trim(),
        description: uploadForm.description,
        order: uploadForm.order ? Number(uploadForm.order) : undefined,
        storageKey,
        firebasePath: storageKey,
        storageProvider: 's3',
        duration: uploadForm.duration ? Number(uploadForm.duration) * 60 : (uploadResult?.duration ? Math.round(uploadResult.duration) : 0),
        isPreview: uploadForm.isPreview,
      }).unwrap();

      // Reset
      setVideoFile(null);
      setUploadForm(emptyVideoForm);
      if (fileRef.current) fileRef.current.value = '';
      refetchVideos();
    } catch (err: any) {
      alert('Upload failed: ' + getErrorMessage(err));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  function openEdit(v: Video): void {
    setEditId(v._id);
    setEditForm({
      title: v.title || '',
      description: v.description || '',
      order: v.order ?? '',
      duration: v.duration ? Math.round(v.duration / 60) : '',
      isPreview: v.isPreview || false,
    });
  }

  async function handleEditSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVideo({
        videoId: editId,
        courseId,
        title: editForm.title,
        description: editForm.description,
        order: editForm.order ? Number(editForm.order) : undefined,
        duration: editForm.duration ? Number(editForm.duration) * 60 : undefined,
        isPreview: editForm.isPreview,
      }).unwrap();
      setEditId(null);
    } catch (err: any) { alert(getErrorMessage(err)); }
    finally { setSaving(false); }
  }

  async function handleDelete(videoId) {
    if (!window.confirm('Delete this video?')) return;
    try {
      await deleteVideo({ videoId, courseId }).unwrap();
    } catch (err: any) { alert(getErrorMessage(err)); }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{getErrorMessage(error, 'Failed to load videos')}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button onClick={() => router.push('/admin/courses')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Videos</h1>
        <p className="text-gray-500 mb-8">{course?.title || 'Course'}</p>

        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload New Video</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video File *</label>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                onChange={e => setVideoFile((e.target.files && e.target.files[0]) || null)}
                disabled={uploading}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} placeholder="Auto-detected from filename" disabled={uploading} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" value={uploadForm.order} onChange={e => setUploadForm(f => ({ ...f, order: e.target.value }))} placeholder="Auto" disabled={uploading} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input type="number" value={uploadForm.duration} onChange={e => setUploadForm(f => ({ ...f, duration: e.target.value }))} disabled={uploading} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={uploadForm.isPreview} onChange={e => setUploadForm(f => ({ ...f, isPreview: e.target.checked }))} disabled={uploading} className="w-4 h-4 rounded text-blue-600" />
                  <span className="text-sm text-gray-700">Free Preview</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} rows={2} disabled={uploading} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-sm text-gray-500 text-center">{uploadProgress}% uploaded</p>
              </div>
            )}

            <button type="submit" disabled={uploading || !videoFile} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Video</>}
            </button>
          </form>
        </motion.div>

        {/* Video List */}
        <h2 className="text-lg font-semibold mb-4">Videos ({videos.length})</h2>
        {videos.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No videos yet</div>
        ) : (
          <div className="space-y-2">
            {[...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map(v => (
              <div key={v._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 flex-wrap">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-sm font-mono text-gray-400 w-8">{v.order}</span>
                <div className="flex-1 min-w-[150px]">
                  <p className="font-medium text-gray-900">{v.title}</p>
                  <p className="text-xs text-gray-400">
                    {v.duration ? `${Math.round(v.duration / 60)} min` : ''}
                    {v.isPreview && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold">PREVIEW</span>}
                  </p>
                </div>
                <button onClick={() => openEdit(v)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(v._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Video</h3>
              <button onClick={() => setEditId(null)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={editForm.order} onChange={e => setEditForm(f => ({ ...f, order: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={editForm.duration} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.isPreview} onChange={e => setEditForm(f => ({ ...f, isPreview: e.target.checked }))} className="w-4 h-4 rounded text-blue-600" />
                <span className="text-sm text-gray-700">Free Preview</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
