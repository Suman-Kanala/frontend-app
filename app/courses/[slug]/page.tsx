import { Metadata } from 'next';
import CourseDetail from '@/views/CourseDetail';

export const revalidate = 300;

interface Course {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  discountPrice?: number;
  isPublished?: boolean;
}

interface CourseResponse {
  course?: Course;
  courses?: Course[];
  [key: string]: unknown;
}

interface CourseParams {
  slug: string;
}

interface CourseDetailPageProps {
  params: Promise<CourseParams>;
}

interface CourseSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url: string;
  image?: string;
  offers: {
    '@type': string;
    price: number;
    priceCurrency: string;
    availability: string;
  };
  provider: {
    '@type': string;
    name: string;
    url: string;
  };
}

export async function generateStaticParams(): Promise<CourseParams[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';
    const res = await fetch(`${apiUrl}/courses`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: CourseResponse = await res.json();
    const courses = Array.isArray(data) ? data : data.courses || [];
    return courses
      .filter((c: Course) => c.slug && c.isPublished !== false)
      .map((c: Course) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';
    const res = await fetch(`${apiUrl}/courses/slug/${resolvedParams.slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data: CourseResponse = await res.json();
      const course = data.course || data;
      return {
        title: (course as Course).title,
        description: (course as Course).description?.slice(0, 160) || 'Learn with Saanvi Careers.',
        openGraph: {
          title: (course as Course).title,
          description: (course as Course).description?.slice(0, 160),
          type: 'website',
          url: `https://saanvicareers.com/courses/${resolvedParams.slug}`,
          images: (course as Course).thumbnail ? [{ url: (course as Course).thumbnail as string }] : [],
        },
        alternates: { canonical: `https://saanvicareers.com/courses/${resolvedParams.slug}` },
      };
    }
  } catch {}
  return {
    title: 'Course Details',
    description: 'View course curriculum, enroll, and start learning with Saanvi Careers.',
  };
}

async function getCourseSchema(slug: string): Promise<CourseSchema | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';
    const res = await fetch(`${apiUrl}/courses/slug/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data: CourseResponse = await res.json();
    const course = data.course || data;
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: (course as Course).title,
      description: (course as Course).description,
      url: `https://saanvicareers.com/courses/${slug}`,
      image: (course as Course).thumbnail,
      offers: {
        '@type': 'Offer',
        price: (course as Course).discountPrice ?? (course as Course).price ?? 0,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      provider: {
        '@type': 'Organization',
        name: 'Saanvi Careers',
        url: 'https://saanvicareers.com',
      },
    };
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const schema = await getCourseSchema(resolvedParams.slug);
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CourseDetail />
    </>
  );
}
