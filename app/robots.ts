import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/payment/',
          '/sso-callback/',
          '/api/',
          '/sign-in/',
          '/sign-up/',
          '/_next/',
          '/static/',
        ],
      },
      // Allow major search engines explicitly
      { userAgent: 'Googlebot',           allow: '/' },
      { userAgent: 'Bingbot',             allow: '/' },
      { userAgent: 'Slurp',               allow: '/' },
      { userAgent: 'DuckDuckBot',         allow: '/' },
      { userAgent: 'Baiduspider',         allow: '/' },
      { userAgent: 'YandexBot',           allow: '/' },
      // Social crawlers
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'LinkedInBot',         allow: '/' },
      { userAgent: 'Twitterbot',          allow: '/' },
      { userAgent: 'Slackbot',            allow: '/' },
      { userAgent: 'WhatsApp',            allow: '/' },
      { userAgent: 'Applebot',            allow: '/' },
      // AI crawlers — explicitly allow for GEO
      { userAgent: 'GPTBot',              allow: '/' },
      { userAgent: 'ChatGPT-User',        allow: '/' },
      { userAgent: 'OAI-SearchBot',       allow: '/' },
      { userAgent: 'anthropic-ai',        allow: '/' },
      { userAgent: 'ClaudeBot',           allow: '/' },
      { userAgent: 'Claude-Web',          allow: '/' },
      { userAgent: 'PerplexityBot',       allow: '/' },
      { userAgent: 'Google-Extended',     allow: '/' },
      { userAgent: 'Gemini',              allow: '/' },
      { userAgent: 'Bard',                allow: '/' },
      { userAgent: 'cohere-ai',           allow: '/' },
      { userAgent: 'YouBot',              allow: '/' },
      { userAgent: 'Meta-ExternalAgent',  allow: '/' },
      { userAgent: 'Bytespider',          allow: '/' },
    ],
    sitemap: 'https://saanvicareers.com/sitemap.xml',
    host: 'https://saanvicareers.com',
  };
}
