'use client';

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCoursesQuery, useGetMyEnrollmentsQuery } from "@/store/api/appApi";
import { getErrorMessage } from "@/store/api/baseQuery";
import StickyCourseCTA from "@/components/StickyCourseCTA";

interface Course {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number | null;
  [key: string]: any;
}

interface Enrollment {
  courseId?: Course | string;
  [key: string]: any;
}

interface AnimationVariant {
  initial: { opacity: number; y: number };
  whileInView: { opacity: number; y: number };
  viewport: { once: boolean };
  transition: { duration: number };
}

interface CoursesPageProps {
  // Currently no props needed
}

const fadeUp: AnimationVariant = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return "";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function truncate(text: string | null | undefined, maxLength: number = 100): string {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

const Courses: React.FC<CoursesPageProps> = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: courses = [], isLoading: loading, error } = useGetCoursesQuery(undefined);
  const { data: enrollments = [] } = useGetMyEnrollmentsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const enrolledIds = useMemo(
    () =>
      new Set(
        enrollments.map((entry) => (entry.courseId?._id || entry.courseId || "").toString())
      ),
    [enrollments]
  );

  function isEnrolled(course: Course): boolean {
    if (!isAuthenticated) return false;
    return enrolledIds.has((course._id || course.id || "").toString());
  }

  function getButtonLabel(course) {
    return isAuthenticated && isEnrolled(course) ? "Continue Learning" : "Enroll Now";
  }

  function handleCardClick(course) {
    router.push(`/courses/${course.slug || course._id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600 font-medium">Loading courses...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center px-6">
          <p className="text-red-500 text-lg font-medium mb-4">{getErrorMessage(error, "Failed to load courses")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="border-b border-gray-200/60 dark:border-gray-700/60 py-14 md:py-16 px-4 md:px-6">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Courses</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Explore our curated collection of courses designed to accelerate your career with hands-on learning and expert guidance.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        {courses.length === 0 ? (
          <motion.div {...fadeUp} className="text-center py-24">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No courses available. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course._id || course.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleCardClick(course)}
                className="group cursor-pointer bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/30" />
                    </div>
                  )}

                  {(course.price != null || course.discountPrice != null) && (
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-800">
                      {course.discountPrice != null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">{formatPrice(course.price)}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatPrice(course.discountPrice)}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {course.price === 0 ? "Free" : formatPrice(course.price)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                    {truncate(course.description, 120)}
                  </p>

                  <div className="flex items-center justify-between mt-auto gap-3">
                    <div className="flex items-baseline gap-2">
                      {course.discountPrice != null ? (
                        <>
                          <span className="font-bold text-gray-900 dark:text-white">{formatPrice(course.discountPrice)}</span>
                          <span className="text-xs text-gray-400 line-through">{formatPrice(course.price)}</span>
                        </>
                      ) : course.price != null ? (
                        <span className="font-bold text-gray-900 dark:text-white">
                          {course.price === 0 ? "Free" : formatPrice(course.price)}
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        isAuthenticated && isEnrolled(course)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {getButtonLabel(course)}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <StickyCourseCTA />
    </div>
  );
};

export default Courses;
