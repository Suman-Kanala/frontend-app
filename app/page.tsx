import { Metadata } from 'next';
import HomeClient from './home-client';

export const revalidate = 3600;

const BASE_URL = 'https://saanvicareers.com';

export const metadata: Metadata = {
  title: 'Saanvi Careers – Recruitment Agency India | IT, Engineering, Healthcare Jobs',
  description:
    'Saanvi Careers is India\'s #1 global recruitment agency. We place IT, Engineering, Healthcare and Finance professionals with top employers in India, USA, UK, Australia, EU and Gulf. 3,200+ placements. 97% success rate. 90-day placement guarantee.',
  keywords: [
    'recruitment agency India', 'job placement India', 'IT jobs India',
    'engineering jobs India', 'healthcare recruitment India', 'finance jobs India',
    'global recruitment agency', 'jobs in USA for Indians', 'jobs in UK for Indians',
    'jobs in Gulf for Indians', 'Bangalore recruitment agency', 'career services India',
    'placement agency India', 'overseas jobs India', 'software engineer jobs Bangalore',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Saanvi Careers – Recruitment Agency India | Global Job Placement',
    description: 'India\'s trusted global recruitment agency. 3,200+ placements across IT, Engineering, Healthcare and Finance in 15+ countries.',
    url: BASE_URL,
    type: 'website',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Saanvi Careers – Global Recruitment & Career Services' }],
  },
};

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: 'Saanvi Careers – Recruitment Agency India | Global Job Placement',
  description: 'India\'s trusted global recruitment agency. 3,200+ placements across IT, Engineering, Healthcare and Finance in 15+ countries.',
  isPartOf: { '@id': `${BASE_URL}/#website` },
  about: { '@id': `${BASE_URL}/#organization` },
  primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE_URL}/og-image.png` },
  datePublished: '2020-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en-IN',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }],
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.speakable'],
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EmploymentAgency'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Saanvi Careers',
  image: `${BASE_URL}/og-image.png`,
  url: BASE_URL,
  telephone: '+91-8074172398',
  email: 'contact@saanvicareers.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bengaluru',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '3200',
    bestRating: '5',
  },
};

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Saanvi Careers Services',
  description: 'Career services and recruitment solutions offered by Saanvi Careers',
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        '@id': `${BASE_URL}/job-finder#service`,
        name: 'Job Finder',
        description: 'Upload your resume and get matched with the best open positions across IT, Engineering, Healthcare and Finance sectors globally.',
        provider: { '@id': `${BASE_URL}/#organization` },
        serviceType: 'Job Matching',
        url: `${BASE_URL}/job-finder`,
        areaServed: 'Worldwide',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        '@id': `${BASE_URL}/services/career-guidance#service`,
        name: 'Career Guidance Session',
        description: 'Personalised 1-on-1 career mentorship with industry experts. 30-minute session at ₹499.',
        provider: { '@id': `${BASE_URL}/#organization` },
        serviceType: 'Career Coaching',
        url: `${BASE_URL}/services/career-guidance`,
        offers: { '@type': 'Offer', price: '499', priceCurrency: 'INR' },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        '@id': `${BASE_URL}/services/ats-resume#service`,
        name: 'ATS Resume Builder',
        description: 'Professional resume optimisation service that bypasses ATS filters and gets you shortlisted.',
        provider: { '@id': `${BASE_URL}/#organization` },
        serviceType: 'Resume Writing',
        url: `${BASE_URL}/services/ats-resume`,
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        '@id': `${BASE_URL}/#interview-support`,
        name: 'Interview Preparation & Coaching',
        description: 'Role-specific mock interviews, answer frameworks, and live feedback sessions.',
        provider: { '@id': `${BASE_URL}/#organization` },
        serviceType: 'Career Coaching',
        areaServed: 'Worldwide',
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Service',
        '@id': `${BASE_URL}/#global-recruitment`,
        name: 'Global Recruitment & Placement',
        description: 'End-to-end recruitment connecting IT, Engineering, Healthcare and Finance professionals with employers in 15+ countries.',
        provider: { '@id': `${BASE_URL}/#organization` },
        serviceType: 'Recruitment',
        areaServed: ['India', 'United States', 'United Kingdom', 'Australia', 'European Union', 'Gulf Countries'],
      },
    },
  ],
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Saanvi Careers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers is a global professional employment services and career services firm headquartered in Bengaluru, India. We connect IT, Engineering, Healthcare and Finance professionals with top employers across India, USA, UK, Australia, EU and Gulf Countries. With 3,200+ successful placements and 97% client satisfaction, we are India\'s trusted recruitment partner.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does Saanvi Careers offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers offers: (1) Job Finder – upload your resume for instant job matching; (2) Career Guidance Sessions – 1-on-1 mentorship at ₹499; (3) ATS Resume Builder – professional resume optimisation; (4) Interview Preparation & Coaching; (5) Global Recruitment in IT, Engineering, Healthcare and Finance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which countries does Saanvi Careers place candidates in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers places candidates in 15+ countries including India, United States, United Kingdom, Australia, European Union countries, and Gulf Countries (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the placement guarantee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers offers a 90-day placement guarantee. If a placed candidate does not work out within 90 days, we find a replacement at no additional cost to the employer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the Career Guidance Session work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Book a 30-minute 1-on-1 video call with an industry expert for ₹499. You will receive a personalised career roadmap, resume review, salary negotiation tips, and industry insights. Sessions are available Monday to Saturday, 9 AM to 7 PM IST.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the ATS Resume Builder work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your current resume (PDF or Word) and enter your target job role. Our system rewrites your resume from scratch using professional standards, generating 3 optimised variants that bypass ATS filters. Download as PDF or HTML instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sectors does Saanvi Careers recruit for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers recruits for IT & Technology, Engineering, Healthcare & Life Sciences, Finance & Banking, Oil & Gas, Construction, and General Management across India, USA, UK, Australia, EU and Gulf Countries.',
      },
    },
  ],
};

export default function HomePage(): JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      <HomeClient />
    </>
  );
}
