import { ReactNode } from 'react';
import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';
import Providers from './providers';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saanvicareers.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
    template: '%s | Saanvi Careers',
  },
  description:
    'Saanvi Careers is a global recruitment and career services firm. We connect IT, Engineering, Healthcare and Finance professionals with top employers across India, USA, UK, Australia, EU and Gulf Countries. 2,500+ placements. 24/7 support.',
  keywords: [
    'careers', 'jobs', 'recruitment agency India', 'job placement', 'IT jobs India',
    'engineering jobs', 'healthcare recruitment', 'global hiring', 'Gen AI course',
    'interview support', 'Bangalore tech jobs', 'overseas jobs from India',
    'placement agency', 'professional employment services', 'career coaching',
    'LLM training', 'AI jobs', 'software jobs Bangalore', 'remote jobs India',
  ],
  authors: [{ name: 'Saanvi Careers', url: 'https://saanvicareers.com' }],
  creator: 'Saanvi Careers',
  publisher: 'Saanvi Careers',
  category: 'Employment & Careers',
  openGraph: {
    siteName: 'Saanvi Careers',
    type: 'website',
    locale: 'en_US',
    url: 'https://saanvicareers.com',
    title: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
    description:
      'Connecting talent with opportunities across IT, Engineering, Healthcare and Finance. 2,500+ placements across 15+ countries.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saanvi Careers – Global Job Placement & Career Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@saanvicareers',
    creator: '@saanvicareers',
    title: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
    description:
      'Connecting talent with opportunities across IT, Engineering, Healthcare and Finance. 2,500+ placements across 15+ countries.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://saanvicareers.com',
  },
};

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': 'https://saanvicareers.com/#organization',
  name: 'Saanvi Careers',
  legalName: 'Saanvi Careers',
  url: 'https://saanvicareers.com',
  logo: {
    '@type': 'ImageObject',
    '@id': 'https://saanvicareers.com/#logo',
    url: 'https://saanvicareers.com/logo.png',
    contentUrl: 'https://saanvicareers.com/logo.png',
    width: 512,
    height: 512,
    caption: 'Saanvi Careers',
  },
  image: 'https://saanvicareers.com/og-image.png',
  description:
    'Saanvi Careers is a global professional employment services and career upskilling firm. We specialise in IT, Engineering, Healthcare and Finance placements across India, USA, UK, Australia, EU and Gulf Countries with 2,500+ successful placements.',
  foundingDate: '2020',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Place', name: 'European Union' },
    { '@type': 'Place', name: 'Gulf Countries' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'Karnataka',
    addressLocality: 'Bengaluru',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'Worldwide',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Career & Recruitment Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'IT & Tech Job Placement',
          description: 'End-to-end IT and technology recruitment for top employers globally.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Generative AI Training Program',
          description: '14-day intensive Gen AI course with placement support at ₹4,999.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Interview Preparation & Support',
          description: 'Live mock interviews and coaching by industry experts.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Global Recruitment Services',
          description: 'Connecting professionals with employers across 15+ countries.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI-Powered Job Finder',
          description: 'Upload your resume and get AI-matched to the best open roles.',
        },
      },
    ],
  },
  knowsAbout: [
    'IT Recruitment', 'Engineering Recruitment', 'Healthcare Staffing',
    'Finance Jobs', 'Generative AI', 'Machine Learning', 'Software Development',
    'Career Coaching', 'Resume Writing', 'Interview Preparation',
  ],
  sameAs: [
    'https://www.linkedin.com/company/saanvi-careers',
    'https://twitter.com/saanvicareers',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://saanvicareers.com/#website',
  name: 'Saanvi Careers',
  url: 'https://saanvicareers.com',
  description:
    'Find jobs, upskill with AI courses, and get placed globally with Saanvi Careers.',
  publisher: { '@id': 'https://saanvicareers.com/#organization' },
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://saanvicareers.com/job-finder?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <meta name="theme-color" content="#635bff" />
        </head>
        <body suppressHydrationWarning>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{page_path:window.location.pathname});`}
              </Script>
            </>
          )}
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
