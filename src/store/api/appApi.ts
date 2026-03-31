import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

// In dev, always use the Next.js proxy (/api → localhost:3001) to avoid CORS.
// In production, use the full API URL from env.
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';

// Direct backend URL — bypasses Next.js proxy for large file uploads
const directApiUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api'
    : process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';

const baseQuery = axiosBaseQuery({ baseUrl });

interface TagDefinition {
  type: string;
  id: string | number;
}

function listTags(
  type: string,
  result: any[] | undefined,
  selector: (item: any) => string | number = (item: any): string | number => item?._id
): TagDefinition[] {
  // Ensure result is an array before mapping
  const items = Array.isArray(result) ? result : [];
  return [
    { type, id: "LIST" } as TagDefinition,
    ...items.map((item: any): TagDefinition => ({ type, id: selector(item) }))
  ];
}

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  keepUnusedDataFor: 120,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 60,
  tagTypes: [
    "News",
    "Course",
    "CourseList",
    "Enrollment",
    "Payment",
    "Video",
    "Comment",
    "AdminPayment",
    "AdminStats",
    "AdminUser",
    "User",
    "InterviewBooking",
    "Monitoring",
  ],
  endpoints: (builder) => ({
    syncAuth: builder.mutation({
      query: (body) => ({ url: "/auth/sync", method: "POST", data: body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    getMe: builder.query({
      query: () => ({ url: "/users/me" }),
      providesTags: [{ type: "User", id: "ME" }],
    }),

    updateMe: builder.mutation({
      query: (body) => ({ url: "/users/me", method: "PUT", data: body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    getNews: builder.query({
      query: () => ({ url: "/news" }),
      transformResponse: (response) => {
        // Backend returns array directly, not wrapped in { news: [...] }
        if (Array.isArray(response)) return response;
        return response?.news || [];
      },
      keepUnusedDataFor: 300,
      providesTags: [{ type: "News", id: "LIST" }],
    }),

    getCourses: builder.query({
      query: () => ({ url: "/courses" }),
      transformResponse: (response: any) => {
        // Handle both array and object responses
        if (Array.isArray(response)) return response;
        return response?.courses || [];
      },
      keepUnusedDataFor: 300,
      providesTags: (result: any) => {
        const tags: any[] = [{ type: "CourseList", id: "PUBLIC" }];
        const courseTags = listTags("Course", result);
        return tags.concat(courseTags) as any;
      },
    }),

    getCourseDetail: builder.query({
      async queryFn(slugOrId: string, _queryApi: any, _extraOptions: any, fetchWithBaseQuery: any) {
        let result = await fetchWithBaseQuery({ url: `/courses/slug/${slugOrId}` });
        if (result.error?.status === 404) {
          result = await fetchWithBaseQuery({ url: `/courses/${slugOrId}` });
        }
        return result;
      },
      keepUnusedDataFor: 300,
      providesTags: (result: any) => {
        const courseId = result?.course?._id;
        const videoTags = (result?.videos || []).map((video: any) => ({ type: "Video", id: video._id }));
        return (courseId
          ? [{ type: "Course", id: courseId }, { type: "CourseList", id: "PUBLIC" }, ...videoTags]
          : [{ type: "CourseList", id: "PUBLIC" }]) as any;
      },
    }),

    getAdminCourses: builder.query({
      query: () => ({ url: "/courses/admin/all" }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        return response?.courses || [];
      },
      providesTags: (result: any) => [
        { type: "CourseList", id: "ADMIN" },
        ...listTags("Course", result),
      ] as any,
    }),

    createCourse: builder.mutation({
      query: (body) => ({ url: "/courses", method: "POST", data: body }),
      invalidatesTags: [
        { type: "CourseList", id: "ADMIN" },
        { type: "CourseList", id: "PUBLIC" },
      ],
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/courses/${id}`, method: "PUT", data: body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        { type: "CourseList", id: "ADMIN" },
        { type: "CourseList", id: "PUBLIC" },
      ],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Course", id },
        { type: "CourseList", id: "ADMIN" },
        { type: "CourseList", id: "PUBLIC" },
      ],
    }),

    getMyEnrollments: builder.query({
      query: () => ({ url: "/enrollments/my" }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        return response?.enrollments || [];
      },
      providesTags: (result: any) => [
        { type: "Enrollment", id: "MY" },
        ...listTags("Enrollment", Array.isArray(result) ? result : []),
      ] as any,
    }),

    getEnrollmentCheck: builder.query({
      query: (courseId: string) => ({ url: `/enrollments/check/${courseId}` }),
      providesTags: (_result: any, _error: any, courseId: string) => [
        { type: "Enrollment", id: "MY" },
        { type: "Enrollment", id: `COURSE-${courseId}` },
      ],
    }),

    updateEnrollmentProgress: builder.mutation({
      query: (body) => ({ url: "/enrollments/progress", method: "POST", data: body }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Enrollment", id: "MY" },
        { type: "Enrollment", id: `COURSE-${courseId}` },
      ],
    }),

    initiatePayment: builder.mutation({
      query: (courseId) => ({ url: "/payments/initiate", method: "POST", data: { courseId } }),
      invalidatesTags: [{ type: "Payment", id: "MY" }],
    }),

    uploadProof: builder.mutation({
      query: ({ formData, onUploadProgress }) => ({
        url: "/upload/proof",
        method: "POST",
        data: formData,
        onUploadProgress,
      }),
    }),

    submitPaymentProof: builder.mutation({
      query: ({ paymentId, ...body }) => ({
        url: `/payments/${paymentId}/proof`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "Payment", id: "MY" },
        { type: "AdminPayment", id: "LIST" },
      ],
    }),

    getMyPayments: builder.query({
      query: () => ({ url: "/payments/my" }),
      providesTags: (result: any) => [
        { type: "Payment", id: "MY" },
        ...listTags("Payment", result),
      ] as any,
    }),

    getPaymentById: builder.query({
      query: (paymentId) => ({ url: `/payments/${paymentId}` }),
      providesTags: (_result, _error, paymentId) => [{ type: "Payment", id: paymentId }],
    }),

    getVideoStream: builder.query({
      query: (videoId) => ({ url: `/videos/${videoId}/stream` }),
      keepUnusedDataFor: 30,
      providesTags: (_result, _error, videoId) => [{ type: "Video", id: videoId }],
    }),

    getCourseVideos: builder.query({
      query: (courseId: string) => ({ url: `/videos/course/${courseId}` }),
      transformResponse: (response: any) => {
        const result = Array.isArray(response) ? response : (response?.videos || []);
        return result;
      },
      providesTags: (result: any, _error: any, courseId: string) => [
        { type: "Video", id: `COURSE-${courseId}` },
        ...listTags("Video", Array.isArray(result) ? result : []),
      ] as any,
    }),

    uploadVideo: builder.mutation({
      query: ({ formData, courseId, onUploadProgress }) => ({
        // Use direct backend URL to bypass any proxy body size limits (dev & prod)
        url: `${directApiUrl}/upload/video?courseId=${courseId}`,
        method: "POST",
        data: formData,
        onUploadProgress,
      }),
    }),

    createVideo: builder.mutation({
      query: (body) => ({ url: "/videos", method: "POST", data: body }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Video", id: `COURSE-${courseId}` },
        { type: "Course", id: courseId },
        { type: "CourseList", id: "PUBLIC" },
        { type: "CourseList", id: "ADMIN" },
      ],
    }),

    updateVideo: builder.mutation({
      query: ({ videoId, ...body }) => ({ url: `/videos/${videoId}`, method: "PUT", data: body }),
      invalidatesTags: (_result, _error, { videoId, courseId }) => [
        { type: "Video", id: videoId },
        { type: "Video", id: `COURSE-${courseId}` },
        { type: "Course", id: courseId },
      ],
    }),

    deleteVideo: builder.mutation({
      query: ({ videoId }) => ({ url: `/videos/${videoId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { courseId, videoId }) => [
        { type: "Video", id: videoId },
        { type: "Video", id: `COURSE-${courseId}` },
        { type: "Course", id: courseId },
      ],
    }),

    getCommentsByVideo: builder.query({
      query: (videoId: string) => ({ url: `/comments/video/${videoId}` }),
      providesTags: (result: any, _error: any, videoId: string) => [
        { type: "Comment", id: `VIDEO-${videoId}` },
        ...listTags("Comment", result),
      ] as any,
    }),

    createComment: builder.mutation({
      query: (body) => ({ url: "/comments", method: "POST", data: body }),
      invalidatesTags: (_result, _error, { videoId }) => [{ type: "Comment", id: `VIDEO-${videoId}` }],
    }),

    deleteComment: builder.mutation({
      query: ({ commentId }) => ({ url: `/comments/${commentId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { videoId }) => [{ type: "Comment", id: `VIDEO-${videoId}` }],
    }),

    getAdminStats: builder.query({
      query: () => ({ url: "/admin/stats" }),
      providesTags: [{ type: "AdminStats", id: "MAIN" }],
    }),

    getPendingPayments: builder.query({
      query: () => ({ url: "/admin/payments/pending" }),
      providesTags: (result: any) => [
        { type: "AdminPayment", id: "PENDING" },
        ...listTags("AdminPayment", result),
      ] as any,
    }),

    getAdminPayments: builder.query({
      query: ({ status = "pending", page = 1, limit = 15 } = {} as any) => ({
        url: "/admin/payments",
        params: status && status !== "all" ? { status, page, limit } : { page, limit },
      }),
      providesTags: (result: any) => {
        const payments = result?.payments || [];
        return [
          { type: "AdminPayment", id: "LIST" },
          ...listTags("AdminPayment", payments),
        ] as any;
      },
    }),

    verifyPayment: builder.mutation({
      query: (paymentId) => ({ url: `/admin/payments/${paymentId}/verify`, method: "POST" }),
      invalidatesTags: [
        { type: "AdminPayment", id: "LIST" },
        { type: "AdminPayment", id: "PENDING" },
        { type: "Payment", id: "MY" },
        { type: "Enrollment", id: "MY" },
        { type: "AdminStats", id: "MAIN" },
      ],
    }),

    rejectPayment: builder.mutation({
      query: ({ paymentId, reason }) => ({
        url: `/admin/payments/${paymentId}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: [
        { type: "AdminPayment", id: "LIST" },
        { type: "AdminPayment", id: "PENDING" },
        { type: "Payment", id: "MY" },
        { type: "AdminStats", id: "MAIN" },
      ],
    }),

    getAdminUsers: builder.query({
      query: ({ page = 1, limit = 20 } = {} as any) => ({
        url: "/admin/users",
        params: { page, limit },
      }),
      providesTags: (result: any) => {
        const users = result?.users || [];
        return [
          { type: "AdminUser", id: "LIST" },
          ...listTags("AdminUser", users),
        ] as any;
      },
    }),

    changeUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: [
        { type: "AdminUser", id: "LIST" },
        { type: "User", id: "ME" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({ url: `/admin/users/${userId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
    }),

    // ========================
    // Interview Support Endpoints
    // ========================

    uploadInterviewScreenshot: builder.mutation({
      query: ({ formData, onUploadProgress }) => ({
        url: "/upload/interview-screenshot",
        method: "POST",
        data: formData,
        onUploadProgress,
      }),
    }),

    createInterviewBooking: builder.mutation({
      query: (body) => ({
        url: "/interview-support",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "InterviewBooking", id: "MY" }],
    }),

    submitInterviewProof: builder.mutation({
      query: ({ bookingId, ...body }) => ({
        url: `/interview-support/${bookingId}/payment-proof`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "InterviewBooking", id: "MY" },
        { type: "InterviewBooking", id: "LIST" },
      ],
    }),

    getMyInterviewBookings: builder.query({
      query: ({ page = 1, limit = 10 } = {} as any) => ({
        url: "/interview-support/my",
        params: { page, limit },
      }),
      providesTags: (result: any) => {
        const bookings = result?.bookings || [];
        return [
          { type: "InterviewBooking", id: "MY" },
          ...listTags("InterviewBooking", bookings),
        ] as any;
      },
    }),

    getAdminInterviewBookings: builder.query({
      query: ({ status = "pending", paymentStatus, page = 1, limit = 15 } = {} as any) => {
        const params: any = { page, limit };
        if (status && status !== "all") params.status = status;
        if (paymentStatus && paymentStatus !== "all") params.paymentStatus = paymentStatus;
        return { url: "/admin/interview-support", params };
      },
      providesTags: (result: any) => {
        const bookings = result?.bookings || [];
        return [
          { type: "InterviewBooking", id: "LIST" },
          ...listTags("InterviewBooking", bookings),
        ] as any;
      },
    }),

    getPendingInterviewCount: builder.query({
      query: () => ({ url: "/admin/interview-support/pending" }),
      providesTags: [{ type: "InterviewBooking", id: "PENDING_COUNT" }],
    }),

    approveInterviewBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/admin/interview-support/${bookingId}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "InterviewBooking", id: "LIST" },
        { type: "InterviewBooking", id: "PENDING_COUNT" },
      ],
    }),

    rejectInterviewBooking: builder.mutation({
      query: ({ bookingId, reason }) => ({
        url: `/admin/interview-support/${bookingId}/reject`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: [
        { type: "InterviewBooking", id: "LIST" },
        { type: "InterviewBooking", id: "PENDING_COUNT" },
      ],
    }),

    // ========================
    // Monitoring Endpoints
    // ========================

    getMonitoringMetrics: builder.query({
      query: () => ({ url: "/monitoring/metrics" }),
      providesTags: ["Monitoring"],
    }),

    getMonitoringErrors: builder.query({
      query: ({ limit = 50 } = {} as any) => ({ url: `/monitoring/errors?limit=${limit}` }),
      providesTags: ["Monitoring"],
    }),

    clearMonitoringErrors: builder.mutation({
      query: () => ({ url: "/monitoring/errors", method: "DELETE" }),
      invalidatesTags: ["Monitoring"],
    }),
  }),
});

export const {
  useSyncAuthMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetNewsQuery,
  useGetCoursesQuery,
  useGetCourseDetailQuery,
  useGetAdminCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetMyEnrollmentsQuery,
  useGetEnrollmentCheckQuery,
  useUpdateEnrollmentProgressMutation,
  useInitiatePaymentMutation,
  useUploadProofMutation,
  useSubmitPaymentProofMutation,
  useGetMyPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetVideoStreamQuery,
  useLazyGetVideoStreamQuery,
  useGetCourseVideosQuery,
  useUploadVideoMutation,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useGetCommentsByVideoQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetAdminStatsQuery,
  useGetPendingPaymentsQuery,
  useGetAdminPaymentsQuery,
  useVerifyPaymentMutation,
  useRejectPaymentMutation,
  useGetAdminUsersQuery,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
  useUploadInterviewScreenshotMutation,
  useCreateInterviewBookingMutation,
  useSubmitInterviewProofMutation,
  useGetMyInterviewBookingsQuery,
  useGetAdminInterviewBookingsQuery,
  useGetPendingInterviewCountQuery,
  useApproveInterviewBookingMutation,
  useRejectInterviewBookingMutation,
  useGetMonitoringMetricsQuery,
  useGetMonitoringErrorsQuery,
  useClearMonitoringErrorsMutation,
} = appApi;
