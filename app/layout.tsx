import { ReactNode } from 'react';
import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from './providers';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const BASE_URL = 'https://saanvicareers.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  title: {
    default: 'Saanvi Careers – Recruitment Agency India | Global Job Placement',
    template: '%s | Saanvi Careers',
  },
  description:
    'Saanvi Careers is India\'s trusted global recruitment agency. We place IT, Engineering, Healthcare and Finance professionals with top employers across India, USA, UK, Australia, EU and Gulf. 3,200+ placements. 97% success rate. 90-day guarantee.',
  keywords: [
    'recruitment agency India',
    'job placement India',
    'IT jobs India',
    'engineering recruitment India',
    'healthcare jobs abroad',
    'finance jobs India',
    'global recruitment agency',
    'career guidance India',
    'resume builder India',
    'ATS resume',
    'interview coaching India',
    'jobs in USA for Indians',
    'jobs in UK for Indians',
    'jobs in Gulf for Indians',
    'Bangalore tech jobs',
    'software engineer jobs India',
    'overseas jobs from India',
    'placement agency Bengaluru',
    'professional employment services India',
    'career services India',
  ],
  authors: [{ name: 'Saanvi Careers', url: BASE_URL }],
  creator: 'Saanvi Careers',
  publisher: 'Saanvi Careers',
  category: 'Employment & Careers',
  classification: 'Professional Employment Services',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    siteName: 'Saanvi Careers',
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    title: 'Saanvi Careers – Recruitment Agency India | Global Job Placement',
    description:
      'India\'s trusted global recruitment agency. 3,200+ placements across IT, Engineering, Healthcare and Finance in 15+ countries. 97% success rate.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Saanvi Careers – Global Recruitment & Career Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@saanvicareers',
    creator: '@saanvicareers',
    title: 'Saanvi Careers – Recruitment Agency India | Global Job Placement',
    description:
      'India\'s trusted global recruitment agency. 3,200+ placements. 97% success rate. IT, Engineering, Healthcare & Finance.',
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-IN': BASE_URL,
      'en-US': BASE_URL,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'msapplication-TileColor': '#635bff',
    'msapplication-config': '/browserconfig.xml',
  },
};

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService', 'EmploymentAgency'],
  '@id': `${BASE_URL}/#organization`,
  name: 'Saanvi Careers',
  legalName: 'Saanvi Careers',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${BASE_URL}/#logo`,
    url: `${BASE_URL}/logo.png`,
    contentUrl: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
    caption: 'Saanvi Careers',
  },
  image: `${BASE_URL}/og-image.png`,
  description:
    'Saanvi Careers is a global professional employment services firm specialising in IT, Engineering, Healthcare and Finance placements across India, USA, UK, Australia, EU and Gulf Countries. 3,200+ successful placements with 97% client satisfaction.',
  foundingDate: '2020',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
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
    postalCode: '560001',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-8074172398',
      contactType: 'customer service',
      email: 'contact@saanvicareers.com',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'Worldwide',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
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
          serviceType: 'Recruitment',
          areaServed: 'Worldwide',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Career Guidance Session',
          description: 'Personalised 1-on-1 career mentorship session with industry experts.',
          serviceType: 'Career Coaching',
          offers: {
            '@type': 'Offer',
            price: '499',
            priceCurrency: 'INR',
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'ATS Resume Builder',
          description: 'Professional resume optimisation service that bypasses ATS filters.',
          serviceType: 'Resume Writing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Interview Preparation & Coaching',
          description: 'Role-specific mock interviews and coaching by industry experts.',
          serviceType: 'Career Coaching',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Global Recruitment Services',
          description: 'Connecting professionals with employers across 15+ countries.',
          serviceType: 'Recruitment',
          areaServed: 'Worldwide',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '3200',
    bestRating: '5',
    worstRating: '1',
  },
  knowsAbout: [
    'IT Recruitment', 'Engineering Recruitment', 'Healthcare Staffing',
    'Finance Jobs', 'Software Development', 'Career Coaching',
    'Resume Writing', 'Interview Preparation', 'Global Placement',
  ],
  sameAs: [
    'https://www.linkedin.com/company/saanvi-careers',
    'https://twitter.com/saanvicareers',
    'https://instagram.com/saanvicareers',
    'https://youtube.com/@saanvicareers',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Saanvi Careers',
  url: BASE_URL,
  description: 'Global recruitment agency and career services platform. Find jobs, get career guidance, and build ATS-optimised resumes.',
  publisher: { '@id': `${BASE_URL}/#organization` },
  inLanguage: 'en-IN',
  copyrightYear: new Date().getFullYear(),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/job-finder?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Job Finder', item: `${BASE_URL}/job-finder` },
    { '@type': 'ListItem', position: 3, name: 'Career Guidance', item: `${BASE_URL}/services/career-guidance` },
    { '@type': 'ListItem', position: 4, name: 'ATS Resume Builder', item: `${BASE_URL}/services/ats-resume` },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en-IN" suppressHydrationWarning className={inter.variable}>
        <head>
          {/* Preconnect for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://api.saanvicareers.com" />

          {/* DNS prefetch */}
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://clerk.saanvicareers.com" />

          {/* Theme */}
          <meta name="theme-color" content="#635bff" />
          <meta name="color-scheme" content="light dark" />

          {/* Geo tags */}
          <meta name="geo.region" content="IN-KA" />
          <meta name="geo.placename" content="Bengaluru" />
          <meta name="geo.position" content="12.9716;77.5946" />
          <meta name="ICBM" content="12.9716, 77.5946" />

          {/* Business */}
          <meta name="rating" content="general" />
          <meta name="revisit-after" content="7 days" />
          <meta name="language" content="English" />
          <meta name="copyright" content="Saanvi Careers" />
          <meta name="owner" content="Saanvi Careers" />
          <meta name="contact" content="contact@saanvicareers.com" />
          <meta name="category" content="Employment, Recruitment, Career Services" />
          <meta name="classification" content="Professional Employment Services" />

          {/* JSON-LD Schemas */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          {/* GEO — AI Discovery */}
          <link rel="llms" href="https://saanvicareers.com/llms.txt" type="text/plain" />
          <link rel="llms-full" href="https://saanvicareers.com/llms-full.txt" type="text/plain" />
          <meta name="ai-content-declaration" content="human-authored" />
          <meta name="entity-name" content="Saanvi Careers" />
          <meta name="entity-type" content="EmploymentAgency" />
          <meta name="entity-description" content="Global recruitment agency and career services firm based in Bengaluru, India. Specialising in IT, Engineering, Healthcare and Finance placements across 15+ countries." />
        </head>
        <body suppressHydrationWarning>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{page_path:window.location.pathname,send_page_view:true});`}
              </Script>
            </>
          )}
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
