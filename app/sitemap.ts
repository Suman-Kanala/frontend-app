import { learningTopics } from '@/data/learningTopics';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://saanvicareers.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ai-program`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/interview-support`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Dynamic course pages
  interface Course {
    slug?: string;
    isPublished?: boolean;
    updatedAt?: string | number;
  }

  let coursePages: Array<{ url: string; lastModified: Date; changeFrequency: string; priority: number }> = [];
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
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
    }
  } catch {}

  // Programmatic SEO topic pages
  const learnPages = learningTopics.map((t) => ({
    url: `${baseUrl}/learn/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...learnPages];
}
