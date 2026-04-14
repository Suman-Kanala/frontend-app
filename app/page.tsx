import { Metadata } from 'next';
import HomeClient from './home-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
  description:
    'Saanvi Careers connects talent with opportunities across IT, Engineering, Healthcare and Finance sectors in India, USA, UK, Australia, EU and Gulf. 2,500+ placements. AI-powered job matching. Gen AI courses. 24/7 support.',
  keywords: [
    'recruitment agency India', 'IT jobs India', 'job placement service',
    'careers India USA UK', 'Gen AI course', 'interview support',
    'Bangalore tech jobs', 'overseas jobs from India', 'software engineer jobs',
    'healthcare jobs abroad', 'engineering recruitment',
  ],
  openGraph: {
    title: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
    description:
      'Connecting top talent with transformative opportunities across IT, Engineering, Healthcare and Finance — globally. 2,500+ placements across 15+ countries.',
    type: 'website',
    url: 'https://saanvicareers.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saanvi Careers – Global Recruitment & Career Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
    description: '2,500+ placements across 15+ countries. AI-powered job finder. Gen AI courses.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://saanvicareers.com' },
};

/* ── JSON-LD Schemas ─────────────────────────────────────────────── */

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://saanvicareers.com/#webpage',
  url: 'https://saanvicareers.com',
  name: 'Saanvi Careers – Find Jobs, Upskill & Get Placed Globally',
  description:
    'Saanvi Careers connects professionals with top employers across IT, Engineering, Healthcare and Finance sectors in India, USA, UK, Australia, EU and Gulf Countries.',
  isPartOf: { '@id': 'https://saanvicareers.com/#website' },
  about: { '@id': 'https://saanvicareers.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://saanvicareers.com',
      },
    ],
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.speakable'],
  },
};

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Saanvi Careers Services',
  description: 'Career services and recruitment solutions offered by Saanvi Careers',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        '@id': 'https://saanvicareers.com/job-finder#service',
        name: 'AI-Powered Job Finder',
        description:
          'Upload your resume and let our AI instantly match you with the best open positions across IT, Engineering, Healthcare and Finance sectors globally.',
        provider: { '@id': 'https://saanvicareers.com/#organization' },
        serviceType: 'Job Matching',
        url: 'https://saanvicareers.com/job-finder',
        areaServed: 'Worldwide',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Course',
        '@id': 'https://saanvicareers.com/ai-program#course',
        name: 'Generative AI Program – 14 Days to Job-Ready',
        description:
          'Intensive 14-day online Gen AI program covering LLMs, prompt engineering, and real-world AI application development with placement support.',
        provider: { '@id': 'https://saanvicareers.com/#organization' },
        url: 'https://saanvicareers.com/ai-program',
        offers: {
          '@type': 'Offer',
          price: '4999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        '@id': 'https://saanvicareers.com/#interview-support',
        name: 'Interview Preparation & Support',
        description:
          'Live mock interviews, resume coaching, and expert interview preparation to help candidates land their dream jobs.',
        provider: { '@id': 'https://saanvicareers.com/#organization' },
        serviceType: 'Career Coaching',
        url: 'https://saanvicareers.com/interview-support',
        areaServed: 'Worldwide',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        '@id': 'https://saanvicareers.com/#global-recruitment',
        name: 'Global Recruitment & Placement',
        description:
          'End-to-end recruitment services connecting IT, Engineering, Healthcare and Finance professionals with employers in 15+ countries including India, USA, UK, Australia, EU and Gulf.',
        provider: { '@id': 'https://saanvicareers.com/#organization' },
        serviceType: 'Recruitment',
        areaServed: [
          'India', 'United States', 'United Kingdom', 'Australia', 'European Union', 'Gulf Countries',
        ],
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
        text: 'Saanvi Careers is a global professional employment services and career upskilling platform. We connect IT, Engineering, Healthcare and Finance professionals with top employers across India, USA, UK, Australia, EU and Gulf Countries. With 2,500+ successful placements and 24/7 support, we are India\'s trusted recruitment partner.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does Saanvi Careers offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers offers: (1) AI-Powered Job Finder – upload your resume for instant job matching; (2) Generative AI Training Program – 14-day course at ₹4,999; (3) Interview Preparation & Coaching; (4) Global Recruitment in IT, Engineering, Healthcare and Finance; (5) Online Courses & Upskilling programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which countries does Saanvi Careers place candidates in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saanvi Careers places candidates in 15+ countries including India (headquarters in Bengaluru), United States, United Kingdom, Australia, European Union countries, and Gulf Countries (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman). We have 2,500+ placements globally.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI job finder work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI Job Finder lets you upload your resume and enter your preferred role and experience. Our AI then analyses your skills and instantly matches you with the most relevant open positions from thousands of jobs across IT, Engineering, Healthcare and Finance sectors globally.',
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
    {
      '@type': 'Question',
      name: 'How much does the Saanvi Careers Gen AI Program cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Generative AI Program is priced at ₹4,999 only. It is a 14-day intensive online course that includes live sessions, real-world AI projects, placement support, and interview preparation.',
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
