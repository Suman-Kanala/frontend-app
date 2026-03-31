import { useAuth } from "@/contexts/AuthContext";
import { useGetEnrollmentCheckQuery, useGetMyEnrollmentsQuery } from "@/store/api/appApi";

interface Enrollment {
  _id: string;
  courseId: string;
  userId: string;
  progress?: number;
  completedAt?: string;
  enrolledAt?: string;
  [key: string]: unknown;
}

interface EnrollmentCheckResponse {
  enrolled: boolean;
  enrollment?: Enrollment;
}

interface UseEnrollmentsReturn {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

interface UseEnrollmentCheckReturn {
  enrolled: boolean;
  enrollment: Enrollment | null;
  loading: boolean;
}

export function useEnrollments(): UseEnrollmentsReturn {
  const { isAuthenticated } = useAuth();
  const { data = [], isLoading, error } = useGetMyEnrollmentsQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    enrollments: data as Enrollment[],
    loading: isLoading,
    error: (error as any)?.message || null,
  };
}

export function useEnrollmentCheck(courseId: string): UseEnrollmentCheckReturn {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetEnrollmentCheckQuery(courseId, {
    skip: !isAuthenticated || !courseId,
  });

  return {
    enrolled: Boolean((data as EnrollmentCheckResponse | undefined)?.enrolled),
    enrollment: ((data as EnrollmentCheckResponse | undefined)?.enrollment) || null,
    loading: isLoading,
  };
}
