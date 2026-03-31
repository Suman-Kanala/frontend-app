import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getTokenGetter } from "@/lib/authToken";

interface ErrorDetails {
  field: string;
  message: string;
}

interface ErrorData {
  error?: string;
  details?: ErrorDetails[];
  [key: string]: unknown;
}

interface QueryError {
  status: number | string;
  data: ErrorData | null;
  message: string;
}

interface QueryRequest extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  url: string;
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface BaseQueryOptions {
  baseUrl?: string;
}

function buildErrorMessage(error: unknown): string {
  const err = error as any;
  const details = err?.response?.data?.details as ErrorDetails[] | undefined;
  const detailText = Array.isArray(details) && details.length
    ? ` (${details.map((item: ErrorDetails) => `${item.field}: ${item.message}`).join(", ")})`
    : "";

  return (err?.response?.data?.error || err?.message || "Request failed") + detailText;
}

export const axiosBaseQuery: (options?: BaseQueryOptions) => BaseQueryFn<QueryRequest, unknown, QueryError> =
  ({ baseUrl = "" }: BaseQueryOptions = {}) =>
  async ({ url, method = "GET", data, params, headers, ...rest }: QueryRequest) => {
    try {
      const tokenGetter = getTokenGetter();
      const token = tokenGetter ? await tokenGetter() : null;
      const mergedHeaders: Record<string, string> = { ...(headers || {}) };

      if (token && !mergedHeaders.Authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
      }

      if (!(data instanceof FormData) && data !== undefined && !mergedHeaders["Content-Type"]) {
        mergedHeaders["Content-Type"] = "application/json";
      }

      const result: AxiosResponse = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: mergedHeaders,
        ...rest,
      });

      return { data: result.data };
    } catch (error) {
      const err = error as any;
      return {
        error: {
          status: err?.response?.status || err?.status || "FETCH_ERROR",
          data: err?.response?.data || null,
          message: buildErrorMessage(error),
        } as QueryError,
      };
    }
  };

interface ErrorMessage {
  message?: string;
  data?: {
    error?: string;
  };
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const err = error as ErrorMessage;
  return err?.message || err?.data?.error || fallback;
}
