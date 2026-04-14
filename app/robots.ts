import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow public, block private routes
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/payment/', '/sso-callback/', '/api/'],
      },
      // Explicitly allow all major AI crawlers for GEO
      { userAgent: 'GPTBot',              allow: '/' },
      { userAgent: 'ChatGPT-User',        allow: '/' },
      { userAgent: 'anthropic-ai',        allow: '/' },
      { userAgent: 'Claude-Web',          allow: '/' },
      { userAgent: 'ClaudeBot',           allow: '/' },
      { userAgent: 'PerplexityBot',       allow: '/' },
      { userAgent: 'Google-Extended',     allow: '/' },
      { userAgent: 'Googlebot',           allow: '/' },
      { userAgent: 'Bingbot',             allow: '/' },
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'LinkedInBot',         allow: '/' },
      { userAgent: 'Twitterbot',          allow: '/' },
      { userAgent: 'Slackbot',            allow: '/' },
      { userAgent: 'WhatsApp',            allow: '/' },
      { userAgent: 'Applebot',            allow: '/' },
    ],
    sitemap: 'https://saanvicareers.com/sitemap.xml',
    host: 'https://saanvicareers.com',
  };
}
