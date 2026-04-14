import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Saanvi Careers – Jobs & Career Platform',
    short_name: 'SaanviCareers',
    description:
      'Find jobs, upskill with AI courses, and get placed globally with Saanvi Careers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060e1d',
    theme_color: '#635bff',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['business', 'education', 'productivity'],
    screenshots: [],
    related_applications: [],
    prefer_related_applications: false,
  };
}
