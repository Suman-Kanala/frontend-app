import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { setTokenGetter as setSharedTokenGetter, getTokenGetter } from '@/lib/authToken';

// In dev, always use the Next.js proxy (/api → localhost:3001) to avoid CORS.
// In production, use the full API URL from env.
const apiBaseUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

interface ErrorDetails {
  field: string;
  message: string;
}

interface ErrorResponse {
  error?: string;
  details?: ErrorDetails[];
}

// Set Content-Type for non-FormData requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Attach Clerk token to every request
export function setTokenGetter(fn: (() => Promise<string | null>) | null): void {
  setSharedTokenGetter(fn);
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const getTokenFn = getTokenGetter();
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* proceed without token */ }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    const error = err as any;
    const details = error?.response?.data?.details as ErrorDetails[] | undefined;
    const detailText = Array.isArray(details) && details.length
      ? ` (${details.map((d) => `${d.field}: ${d.message}`).join(', ')})`
      : '';
    const msg = (error?.response?.data?.error || error?.message || 'Request failed') + detailText;
    return Promise.reject(new Error(msg));
  }
);

export default api;
