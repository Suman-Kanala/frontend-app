import { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://saanvicareers.com';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    // Core pages — highest priority
    { url: baseUrl,                                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/job-finder`,                         lastModified: now, changeFrequency: 'daily',   priority: 0.95 },

    // Service pages
    { url: `${baseUrl}/services/career-guidance`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/services/career-guidance/book`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/services/ats-resume`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },

    // Company pages
    { url: `${baseUrl}/about`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/saanvi-careers`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Legal pages
    { url: `${baseUrl}/privacy-policy`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/refund-policy`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/shipping-policy`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  return staticPages;
}
