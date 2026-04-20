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
      // Security + SEO headers for all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control',    value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-Robots-Tag',              value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        ],
      },
      // Static public pages — CDN cacheable
      {
        source: '/(|job-finder|services/:path*|about|privacy-policy|refund-policy|shipping-policy|terms)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60' },
        ],
      },
      // Auth + admin — never cached
      {
        source: '/(admin|payment|sign-in|sign-up|sso-callback)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, no-cache' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Static assets — long cache
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Images
      {
        source: '/:path*.{jpg,jpeg,png,gif,webp,avif,svg,ico}',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
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
