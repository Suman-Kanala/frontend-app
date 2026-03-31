'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Lock,
  MessageSquare,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import dynamic from 'next/dynamic';
const VideoJsPlayer = dynamic(() => import('@/components/video/VideoJsPlayer'), { ssr: false });
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetCourseDetailQuery,
  useGetEnrollmentCheckQuery,
  useLazyGetVideoStreamQuery,
  useGetCommentsByVideoQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateEnrollmentProgressMutation,
} from "@/store/api/appApi";
import { getErrorMessage } from "@/store/api/baseQuery";

const tabs = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "discussion", label: "Discussion", icon: MessageSquare },
  { id: "resources", label: "Resources", icon: BookOpen },
];

const toSeconds = (value) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
};

const formatDuration = (seconds) => {
  const total = Math.floor(toSeconds(seconds));
  if (total <= 0) return "0:00";
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
};

const formatTotalDuration = (seconds) => {
  const total = Math.floor(toSeconds(seconds));
  if (total <= 0) return "";
  if (total < 60) return `${total} sec`;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

const formatLessonDuration = (seconds) => {
  const total = toSeconds(seconds);
  return total > 0 ? formatDuration(total) : "";
};

const inferPlaybackType = (value) => {
  const normalized = String(value || "").split("?")[0].toLowerCase();
  if (normalized.endsWith(".m3u8")) return "application/x-mpegURL";
  if (normalized.endsWith(".mpd")) return "application/dash+xml";
  if (normalized.endsWith(".webm")) return "video/webm";
  return "video/mp4";
};

const normalizePlaybackPayload = (payload, video) => {
  const src = payload?.playback?.src || payload?.url || payload?.streamUrl || payload?.src;
  if (!src) return null;
  return {
    src,
    type: payload?.playback?.type || payload?.type || inferPlaybackType(src),
    poster: payload?.playback?.poster || video?.thumbnail || "",
    drm: payload?.playback?.drm || null,
    plugins: payload?.playback?.plugins || {},
    availableQualities: payload?.playback?.availableQualities || ["source"],
  };
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "SC";

const formatCommentDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return "";
  }
};

const buildLessonState = (videos, enrollment, enrolled) => {
  const completed = new Set((enrollment?.progress?.completedVideos || []).map((id) => id.toString()));
  let nextUnlockedFound = false;

  return videos.map((video, index) => {
    const isCompleted = completed.has(video._id?.toString());
    const previewUnlocked = Boolean(video.isPreview && !enrolled);
    let isUnlocked = previewUnlocked || isCompleted;

    if (!isUnlocked && enrolled && !nextUnlockedFound) {
      isUnlocked = true;
      nextUnlockedFound = true;
    } else if (!previewUnlocked && !isCompleted && enrolled) {
      nextUnlockedFound = true;
    }

    return { ...video, listIndex: index, isCompleted, isUnlocked };
  });
};

const getResumeKey = (courseId, videoId) => `saanvi:resume:${courseId}:${videoId}`;
const getNotesKey = (courseId, videoId) => `saanvi:notes:${courseId}:${videoId}`;

interface Video {
  _id?: string;
  title?: string;
  description?: string;
  duration?: number;
  order?: number;
  isPreview?: boolean;
  [key: string]: any;
}

interface WatchState {
  currentTime: number;
  duration: number;
  rate: number;
}

export default function CourseDetail() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : undefined;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, login, user } = useAuth();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [playback, setPlayback] = useState<any>(null);
  const [playbackError, setPlaybackError] = useState<string>("");
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [commentBody, setCommentBody] = useState<string>("");
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);
  const [notesDraft, setNotesDraft] = useState<string>("");
  const [resumeTime, setResumeTime] = useState<number>(0);
  const [watchState, setWatchState] = useState<WatchState>({ currentTime: 0, duration: 0, rate: 1 });

  const playerRef = useRef<any>(null);
  const lastSavedSecondRef = useRef<number>(-1);
  const completedSubmissionRef = useRef<Set<string>>(new Set());
  const playlistRefs = useRef<Record<string, any>>({});
  const playlistScrolledRef = useRef<boolean>(false);

  // RTK Query hooks
  const { data: courseData, isLoading: courseLoading, error: courseError } = useGetCourseDetailQuery(slug || '', { skip: !slug });
  const course = courseData?.course ? { ...courseData.course, videos: [...(courseData.videos || [])] } : null;

  const { data: enrollmentData, refetch: refetchEnrollment, isLoading: enrollmentLoading, isFetching: enrollmentFetching } = useGetEnrollmentCheckQuery(course?._id, { skip: !isAuthenticated || !course?._id });
  const enrolled = enrollmentData?.enrolled || false;
  const enrollment = enrollmentData?.enrollment || null;
  // Only consider enrollment checked when the query has actually settled (not loading/fetching)
  const enrollmentChecked = !isAuthenticated || (!enrollmentLoading && !enrollmentFetching && enrollmentData !== undefined);

  const [getVideoStream] = useLazyGetVideoStreamQuery();
  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useGetCommentsByVideoQuery(activeVideo?._id || '', { skip: !activeVideo?._id });
  const comments = commentsData ? [...commentsData] : [];

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateEnrollmentProgress] = useUpdateEnrollmentProgressMutation();

  useEffect(() => {
    if (courseLoading || authLoading || !course?._id) return;
    if (!isAuthenticated) return;
    if (!enrolled && enrollmentChecked) {
      router.replace(`/payment/${course._id}`);
    }
  }, [courseLoading, authLoading, course?._id, enrollmentChecked, isAuthenticated, enrolled, router]);

  const videos = useMemo(() => {
    const ordered = (course?.videos || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return buildLessonState(ordered, enrollment, enrolled);
  }, [course?.videos, enrollment, enrolled]);

  const lastCompletedLesson = useMemo(() => {
    for (let index = videos.length - 1; index >= 0; index -= 1) {
      if (videos[index]?.isCompleted) return videos[index];
    }
    return null;
  }, [videos]);

  useEffect(() => {
    if (!videos.length || activeVideo) return;
    const lastWatchedId = enrollment?.progress?.lastWatchedVideo?.toString?.();
    const preferred =
      videos.find((video) => video._id?.toString() === lastWatchedId && video.isUnlocked) ||
      videos.find((video) => video.isUnlocked) ||
      videos[0];
    setActiveVideo(preferred);
  }, [videos, activeVideo, enrollment?.progress?.lastWatchedVideo]);

  const loadPlayback = useCallback(async (video) => {
    if (!video || !video.isUnlocked) return;
    setVideoLoading(true);
    setPlayback(null);
    setPlaybackError("");
    try {
      const result = await getVideoStream(video._id).unwrap();
      setPlayback(normalizePlaybackPayload(result, video));
    } catch (err: any) {
      console.error("Failed to load video stream:", err);
      setPlayback(null);
      setPlaybackError(getErrorMessage(err, "Failed to load this lesson"));
    } finally {
      setVideoLoading(false);
    }
  }, [getVideoStream]);

  useEffect(() => {
    if (!activeVideo?._id || !course?._id) return;
    loadPlayback(activeVideo);
    const savedResume = JSON.parse(window.localStorage.getItem(getResumeKey(course._id, activeVideo._id)) || "null");
    setResumeTime(savedResume?.currentTime || 0);
    setNotesDraft(window.localStorage.getItem(getNotesKey(course._id, activeVideo._id)) || "");
    setWatchState({
      currentTime: savedResume?.currentTime || 0,
      duration: savedResume?.duration || activeVideo.duration || 0,
      rate: 1,
    });
    lastSavedSecondRef.current = -1;
  }, [activeVideo, course?._id, loadPlayback]);

  useEffect(() => {
    const targetId = lastCompletedLesson?._id || activeVideo?._id;
    if (!targetId) return;

    const node = playlistRefs.current[targetId];
    if (!node) return;

    const behavior = playlistScrolledRef.current ? "smooth" : "auto";
    node.scrollIntoView({ block: "center", behavior });
    playlistScrolledRef.current = true;
  }, [lastCompletedLesson?._id, activeVideo?._id, videos.length]);


  const markComplete = useCallback(async (videoId = activeVideo?._id) => {
    if (!videoId || !course?._id || !enrolled || completedSubmissionRef.current.has(videoId)) return;
    completedSubmissionRef.current.add(videoId);
    try {
      await updateEnrollmentProgress({ courseId: course._id, videoId, completed: true }).unwrap();
      await refetchEnrollment();
    } catch (err: any) {
      completedSubmissionRef.current.delete(videoId);
      console.error("Failed to track progress:", err);
    }
  }, [activeVideo?._id, course?._id, enrolled, updateEnrollmentProgress, refetchEnrollment]);

  const handleProgress = useCallback(({ currentTime, duration, playbackRate }) => {
    setWatchState({ currentTime, duration: duration || activeVideo?.duration || 0, rate: playbackRate || 1 });
    if (!course?._id || !activeVideo?._id) return;
    const second = Math.floor(currentTime || 0);
    if (second !== lastSavedSecondRef.current) {
      lastSavedSecondRef.current = second;
      window.localStorage.setItem(
        getResumeKey(course._id, activeVideo._id),
        JSON.stringify({ currentTime, duration: duration || activeVideo?.duration || 0 })
      );
      setResumeTime(currentTime);
    }
    const totalDuration = duration || activeVideo?.duration || 0;
    if (enrolled && totalDuration > 0 && currentTime / totalDuration >= 0.9) {
      markComplete(activeVideo._id);
    }
  }, [activeVideo?._id, activeVideo?.duration, course?._id, enrolled, markComplete]);

  const handleResume = useCallback(() => {
    if (!playerRef.current || !resumeTime) return;
    playerRef.current.currentTime(resumeTime);
    playerRef.current.play?.().catch?.(() => {});
  }, [resumeTime]);

  const handlePlayerReady = useCallback((player) => {
    playerRef.current = player;
  }, []);

  const handlePlayerEnded = useCallback(() => {
    markComplete();
  }, [markComplete]);

  const handleCommentSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!activeVideo?._id || !course?._id) return;
    if (!isAuthenticated) return login();
    if (!commentBody.trim()) return;
    setCommentSubmitting(true);
    try {
      await createComment({
        courseId: course._id,
        videoId: activeVideo._id,
        body: commentBody.trim(),
      }).unwrap();
      setCommentBody("");
      await refetchComments();
    } catch (err: any) {
      alert(getErrorMessage(err, "Failed to post comment"));
    } finally {
      setCommentSubmitting(false);
    }
  }, [activeVideo?._id, commentBody, course?._id, isAuthenticated, login, createComment, refetchComments]);

  const handleDeleteComment = useCallback(async (commentId, videoId) => {
    try {
      await deleteComment({ commentId, videoId }).unwrap();
      await refetchComments();
    } catch (err: any) {
      alert(getErrorMessage(err, "Failed to delete comment"));
    }
  }, [deleteComment, refetchComments]);

  const handleSaveNotes = useCallback(() => {
    if (!course?._id || !activeVideo?._id) return;
    window.localStorage.setItem(getNotesKey(course._id, activeVideo._id), notesDraft);
  }, [course?._id, activeVideo?._id, notesDraft]);

  const handleSelectVideo = useCallback((video) => {
    if (video?.isUnlocked) setActiveVideo(video);
  }, []);

  const completedCount = Math.min(enrollment?.progress?.completedVideos?.length || 0, videos.length);
  const progressPercent = videos.length ? Math.round((completedCount / videos.length) * 100) : 0;
  const activeIndex = videos.findIndex((video) => video._id === activeVideo?._id);
  const previousLesson = activeIndex > 0 ? videos[activeIndex - 1] : null;
  const nextLesson = activeIndex >= 0 ? videos[activeIndex + 1] : null;
  const totalCourseDuration = videos.reduce((sum, video) => sum + toSeconds(video.duration), 0);
  const currentPercent = (watchState.duration || activeVideo?.duration || 0) > 0
    ? Math.min(100, Math.round((watchState.currentTime / (watchState.duration || activeVideo?.duration || 1)) * 100))
    : activeVideo?.isCompleted ? 100 : 0;
  const takeaways = (activeVideo?.description || course?.description || "")
    .split(/\r?\n|[.?!]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (courseLoading || authLoading || (isAuthenticated && course?._id && (enrollmentLoading || enrollmentFetching))) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="h-10 w-10 animate-spin text-cyan-300" /></div>;
  }
  if (courseError) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-rose-300">{getErrorMessage(courseError, "Failed to load course")}</div>;
  }
  if (!course) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,#020617,#0f172a,#111827)] text-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 md:px-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-cyan-200/80 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_340px] xl:grid-cols-[minmax(0,1.9fr)_360px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/80 shadow-[0_32px_120px_rgba(15,23,42,0.45)]">
              <div className="relative">
                <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#8b5cf6)]" style={{ width: `${currentPercent}%` }} />
                </div>

                {videoLoading ? (
                  <div className="flex h-[28rem] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-cyan-300" /></div>
                ) : playback ? (
                  <VideoJsPlayer
                    key={playback.src}
                    playback={playback}
                    onEnded={handlePlayerEnded}
                    onProgress={handleProgress}
                    onPlayerReady={handlePlayerReady}
                    restrictForwardSeek={enrolled}
                  />
                ) : (
                  <div className="flex h-[28rem] flex-col items-center justify-center gap-3 px-6 text-center">
                    <p className="text-lg font-medium text-white">This lesson could not be loaded.</p>
                    <p className="max-w-xl text-sm text-slate-400">
                      {playbackError || "Select an unlocked lesson to begin."}
                    </p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 md:p-5">
                  <div className="pointer-events-auto flex flex-wrap gap-2">
                    {resumeTime > 15 && (
                      <button onClick={handleResume} className="rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur-md">
                        Resume from {formatDuration(resumeTime)}
                      </button>
                    )}
                    {activeVideo?.isCompleted && (
                      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur-md">
                        Lesson completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span>{videos.length} lessons</span>
                  {totalCourseDuration > 0 && (
                    <>
                      <span>|</span>
                      <span>{formatTotalDuration(totalCourseDuration)}</span>
                    </>
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{activeVideo?.title || course.title}</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
                  {toSeconds(activeVideo?.duration) > 0 && (
                    <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-cyan-200" /> {formatLessonDuration(activeVideo?.duration)}</span>
                  )}
                  <span>{progressPercent}% course progress</span>
                  {!enrolled && activeVideo?.isPreview && <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Preview</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {enrolled && !activeVideo?.isCompleted && (
                  <button onClick={() => markComplete()} className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                    Mark complete
                  </button>
                )}
                {nextLesson?.isUnlocked ? (
                  <button onClick={() => handleSelectVideo(nextLesson)} className="rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)] px-4 py-3 text-sm font-semibold text-white">
                    Next lesson
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <Lock className="h-4 w-4" /> Finish this lesson to continue
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 border-b border-white/10">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-t-2xl px-4 py-3 text-sm font-medium ${activeTab === tab.id ? "border border-b-0 border-white/10 bg-white/[0.06] text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      <Icon className="h-4 w-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Lesson overview</p>
                    <h3 className="mt-2 text-2xl font-semibold">What to focus on</h3>
                    <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-300">{activeVideo?.description?.trim() ? activeVideo.description : course.description || "No lesson description has been added yet."}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Key takeaways</p>
                    <div className="mt-4 space-y-3">
                      {(takeaways.length ? takeaways : ["Complete each lesson to unlock the next one.", "Use notes and discussion to keep learning in context."]).map((item, index) => (
                        <div key={`${item}-${index}`} className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                          <p className="text-sm leading-7 text-slate-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Private notes</p>
                    <textarea value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} rows={14} placeholder="Write key ideas, revision notes, or action items for this lesson..." className="mt-4 w-full resize-none rounded-[24px] border border-white/10 bg-slate-950/45 px-5 py-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500" />
                    <button onClick={handleSaveNotes} className="mt-4 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Save notes</button>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5 text-sm leading-7 text-slate-300">
                    Notes are saved on this device for now, so learners can keep key ideas beside the lesson.
                  </div>
                </div>
              )}

              {activeTab === "discussion" && (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Discussion</p>
                      <h3 className="mt-2 text-2xl font-semibold">Comments & doubts</h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{comments.length} comments</span>
                  </div>

                  <form onSubmit={handleCommentSubmit} className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                    <textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} rows={4} placeholder={isAuthenticated ? "Ask a question or share a takeaway..." : "Sign in to join the discussion"} className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">Comments stay linked to this lesson.</p>
                      <button type="submit" disabled={commentSubmitting || !activeVideo || !commentBody.trim()} className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                        {commentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Post
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-4">
                    {commentsLoading ? (
                      <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-cyan-300" /></div>
                    ) : comments.length === 0 ? (
                      <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 p-8 text-center text-slate-300">No comments yet for this lesson.</div>
                    ) : comments.map((comment) => {
                      const canDelete = user && (user.role === "admin" || user._id === comment.user?._id);
                      return (
                        <div key={comment._id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                          <div className="flex items-start gap-3">
                            {comment.user?.picture ? (
                              <img src={comment.user.picture} alt={comment.user.name} className="h-11 w-11 rounded-2xl object-cover" />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)] text-sm font-semibold text-white">{initials(comment.user?.name)}</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="font-medium text-white">{comment.user?.name || "Learner"}</p>
                                  <p className="text-xs text-slate-400">{formatCommentDate(comment.createdAt)}</p>
                                </div>
                                {comment.user?.role && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{comment.user.role}</span>}
                              </div>
                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{comment.body}</p>
                              {canDelete && <button onClick={() => handleDeleteComment(comment._id, activeVideo?._id || '')} className="mt-3 text-xs uppercase tracking-[0.2em] text-rose-300">Delete</button>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Lesson length</p><p className="mt-3 text-sm text-cyan-200">{formatLessonDuration(activeVideo?.duration) || "Not available yet"}</p></div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Unlock rule</p><p className="mt-3 text-sm text-violet-200">{enrolled ? "Complete this lesson to unlock the next one" : "Preview only until enrollment"}</p></div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Discussion access</p><p className="mt-3 text-sm text-emerald-200">{isAuthenticated ? "You can ask questions on this lesson" : "Sign in to participate"}</p></div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
            <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] shadow-[0_24px_70px_rgba(15,23,42,0.5)]">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Course content</p>
                    <h3 className="mt-2 text-xl font-semibold">Learning path</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{videos.length} total</span>
                </div>
                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400"><span>Course progress</span><span>{progressPercent}%</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#8b5cf6)]" style={{ width: `${progressPercent}%` }} /></div>
                  <p className="mt-3 text-sm text-slate-300">{completedCount} of {videos.length} lessons completed</p>
                </div>
              </div>

              <div className="playlist-scroll-shell px-4 pb-4 pt-3">
                <div className="playlist-scrollbar max-h-[min(58vh,720px)] min-h-[22rem] space-y-3 overflow-y-auto pr-2">
                {videos.map((video, index) => {
                  const isActive = activeVideo?._id === video._id;
                  const isLocked = !video.isUnlocked;
                  return (
                    <button key={video._id || index} ref={(node) => { playlistRefs.current[video._id] = node; }} onClick={() => handleSelectVideo(video)} disabled={isLocked} className={`w-full rounded-2xl border p-4 text-left transition-all ${isActive ? "border-cyan-400/40 bg-cyan-400/10" : isLocked ? "border-white/5 bg-white/[0.03] opacity-70" : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border ${video.isCompleted ? "border-emerald-400/20 bg-emerald-400/15 text-emerald-300" : isLocked ? "border-white/10 bg-white/5 text-slate-500" : "border-cyan-400/20 bg-cyan-400/15 text-cyan-200"}`}>
                          {video.isCompleted ? <CheckCircle className="h-4 w-4" /> : isLocked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Lesson {index + 1}</p>
                            {toSeconds(video.duration) > 0 && <span className="text-xs text-slate-400">{formatLessonDuration(video.duration)}</span>}
                          </div>
                          <h4 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{video.title}</h4>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {video.isCompleted && <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Completed</span>}
                            {!video.isCompleted && isActive && <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Playing</span>}
                            {isLocked && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Locked</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4 md:px-6">
        <div className="pointer-events-auto mx-auto flex max-w-[1500px] items-center justify-between gap-3 rounded-[26px] border border-white/10 bg-slate-950/80 px-4 py-3 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <button onClick={() => previousLesson && handleSelectVideo(previousLesson)} disabled={!previousLesson} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-200 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
          <div className="hidden min-w-0 text-center md:block">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Up next</p>
            <p className="mt-1 truncate text-sm font-medium text-white">{nextLesson?.title || "You're at the end of this course section"}</p>
          </div>
          <button onClick={() => nextLesson?.isUnlocked && handleSelectVideo(nextLesson)} disabled={!nextLesson || !nextLesson.isUnlocked} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
