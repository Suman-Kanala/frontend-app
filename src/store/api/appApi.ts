import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

// In dev, always use the Next.js proxy (/api → localhost:3001) to avoid CORS.
// In production, use the full API URL from env.
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';

const baseQuery = axiosBaseQuery({ baseUrl });

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery,
  keepUnusedDataFor: 120,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 60,
  tagTypes: [
    "News",
    "User",
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
        if (Array.isArray(response)) return response;
        return response?.news || [];
      },
      transformErrorResponse: () => [],
      keepUnusedDataFor: 21600,
      providesTags: [{ type: "News", id: "LIST" }],
    }),
  }),
});

export const {
  useSyncAuthMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetNewsQuery,
} = appApi;
