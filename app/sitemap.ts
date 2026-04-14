import { MetadataRoute } from 'next';
import { learningTopics } from '@/data/learningTopics';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://saanvicareers.com';
  const now = new Date();

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/job-finder`,           lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/courses`,              lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/ai-program`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/interview-support`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  // Dynamic course pages
  interface Course {
    slug?: string;
    isPublished?: boolean;
    updatedAt?: string | number;
  }

  let coursePages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.saanvicareers.com/api';
    const res = await fetch(`${apiUrl}/courses`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data: unknown = await res.json();
      const courses: Course[] = Array.isArray(data) ? data : (data as { courses?: Course[] }).courses || [];
      coursePages = courses
        .filter((c: Course) => c.slug && c.isPublished !== false)
        .map((c: Course) => ({
          url: `${baseUrl}/courses/${c.slug}`,
          lastModified: new Date(c.updatedAt || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));
    }
  } catch {}

  // Programmatic SEO topic pages
  const learnPages: MetadataRoute.Sitemap = learningTopics.map((t) => ({
    url: `${baseUrl}/learn/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...learnPages];
}
