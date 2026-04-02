/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable compression
  compress: true,

  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,

  // Optimize package imports
  transpilePackages: ['@radix-ui'],

  // Allow large file uploads through the proxy (10GB for videos)
  experimental: {
    serverActions: {
      bodySizeLimit: '10gb',
    },
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
    ],
  },

  // Increase middleware body size limit for large video uploads
  middlewareClientMaxBodySize: '10gb',

  // Disable dev indicators (removes Next.js icon in bottom corner)
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },

  // Rewrites for API proxy (development only)
  // NOTE: rewrites are disabled because app/api/[...path]/route.ts handles proxying
  async rewrites() {
    return [];
  },

  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Static public pages — CDN-cacheable, ISR-controlled revalidation
      {
        source: '/(|courses|ai-program)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
          },
        ],
      },
      // Course detail pages — 5-min CDN cache with stale fallback
      {
        source: '/courses/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      // Auth + dynamic user pages — never CDN-cached
      {
        source: '/(dashboard|admin|payment|interview-support|sign-in|sign-up|sso-callback)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, no-cache',
          },
        ],
      },
      // Public folder assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
