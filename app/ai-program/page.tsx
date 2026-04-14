import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gen AI Program – Become Job-Ready in 14 Days | Saanvi Careers',
  description:
    'Join Saanvi Careers Generative AI Program. Become job-ready in Gen AI in just 14 days with real-time industry projects, placement support & interview prep. ₹4,999 only. Enrol now.',
  keywords: [
    'Gen AI program India', 'Generative AI course', 'LLM training', 'prompt engineering course',
    'AI job ready course', 'AI certification India', 'ChatGPT training', 'AI placement support',
    'online AI course ₹4999', '14 day AI program',
  ],
  openGraph: {
    title: 'Gen AI Program – Become Job-Ready in 14 Days | Saanvi Careers',
    description:
      'Intensive 14-day Gen AI program. Learn LLMs, prompt engineering, real-world AI projects. Placement support included. ₹4,999 only.',
    type: 'website',
    url: 'https://saanvicareers.com/ai-program',
    images: [
      {
        url: '/og-ai-program.png',
        width: 1200,
        height: 630,
        alt: 'Saanvi Careers Gen AI Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gen AI Program – Job-Ready in 14 Days | Saanvi Careers',
    description: 'Learn Generative AI in 14 days. Real projects, placement support. ₹4,999.',
    images: ['/og-ai-program.png'],
  },
  alternates: { canonical: 'https://saanvicareers.com/ai-program' },
};

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': 'https://saanvicareers.com/ai-program#course',
  name: 'Generative AI Program – 14 Days to Job-Ready',
  description:
    'A 14-day intensive online program covering Generative AI fundamentals, large language models (LLMs), prompt engineering, real-world AI application development, and career placement support.',
  url: 'https://saanvicareers.com/ai-program',
  provider: {
    '@id': 'https://saanvicareers.com/#organization',
    '@type': 'Organization',
    name: 'Saanvi Careers',
  },
  offers: {
    '@type': 'Offer',
    price: '4999',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
    url: 'https://saanvicareers.com/ai-program',
  },
  courseMode: 'online',
  duration: 'P14D',
  educationalLevel: 'Beginner to Intermediate',
  inLanguage: 'en',
  teaches: [
    'Generative AI', 'Large Language Models', 'Prompt Engineering',
    'AI Application Development', 'ChatGPT API', 'LangChain', 'Vector Databases',
  ],
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: {
      '@type': 'Person',
      name: 'Saanvi Careers Expert',
      worksFor: { '@id': 'https://saanvicareers.com/#organization' },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '120',
    bestRating: '5',
    worstRating: '1',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Saanvi Careers Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Gen AI Program is a 14-day intensive online course that teaches Generative AI fundamentals, large language models (LLMs), prompt engineering, and real-world AI application development. It is designed to make you job-ready in Generative AI quickly, with placement support and interview preparation included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who should take this Generative AI course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This program is ideal for working professionals, recent graduates, and developers who want to learn Generative AI, LLMs, and prompt engineering to advance their careers in AI-driven roles.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does the Gen AI Program cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The program is priced at ₹4,999 only, which includes live sessions, real-world AI projects, placement support, and interview preparation with industry experts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I get placement support after the Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Saanvi Careers provides dedicated placement support and interview preparation as part of the Gen AI Program. Our placement team helps you connect with top employers hiring for AI and tech roles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What skills will I learn in the Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You will learn Generative AI fundamentals, large language models (LLMs), prompt engineering, real-world AI application development, ChatGPT API, LangChain, vector databases, and industry use cases across 14 days of intensive training.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Gen AI Program conducted online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the Gen AI Program is fully online. You can join from anywhere in India or abroad. Classes are live and interactive, with recordings available for revision.',
      },
    },
  ],
};

const AIProgram = dynamic(() => import('@/views/AIProgram'));

export default function AIProgramPage(): JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AIProgram />
    </>
  );
}
