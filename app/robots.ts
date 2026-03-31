export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/payment', '/sso-callback'],
      },
    ],
    sitemap: 'https://saanvicareers.com/sitemap.xml',
  };
}
