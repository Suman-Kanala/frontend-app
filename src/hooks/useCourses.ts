import { useGetCourseDetailQuery, useGetCoursesQuery } from "@/store/api/appApi";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  thumbnail?: string;
  isPublished?: boolean;
  [key: string]: unknown;
}

interface CourseDetail extends Course {
  videos?: Array<{ _id: string; [key: string]: unknown }>;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

interface UseCourseReturn {
  data: CourseDetail | undefined;
  loading: boolean;
  error: string | null;
}

export function useCourses(): UseCoursesReturn {
  const { data = [], isLoading, error } = useGetCoursesQuery(undefined);
  return {
    courses: data as Course[],
    loading: isLoading,
    error: (error as any)?.message || null,
  };
}

export function useCourse(slug: string): UseCourseReturn {
  const { data, isLoading, error } = useGetCourseDetailQuery(slug, {
    skip: !slug,
  });

  return {
    data: data as CourseDetail | undefined,
    loading: isLoading,
    error: (error as any)?.message || null,
  };
}
