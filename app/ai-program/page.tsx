import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gen AI Program - Become Job-Ready in 14 Days | Saanvi Careers',
  description:
    'Join Saanvi Careers Generative AI Program. Become job-ready in Gen AI in just 14 days with real-time industry projects, placement support & interview prep. ₹4,999 only.',
  openGraph: {
    title: 'Gen AI Program - Saanvi Careers',
    description: 'Become job-ready in Generative AI in 14 days. Real projects, placement support. ₹4,999.',
    type: 'website',
    url: 'https://saanvicareers.com/ai-program',
  },
  alternates: { canonical: 'https://saanvicareers.com/ai-program' },
};

interface FAQEntity {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: FAQEntity[];
}

const faqSchema: FAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Saanvi Careers Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Gen AI Program is a 14-day intensive course that teaches Generative AI with real-world projects, designed to make you job-ready quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who should take this Generative AI course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This program is ideal for working professionals, students, and developers who want to learn Generative AI, LLMs, and prompt engineering to advance their careers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does the Gen AI Program cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The program is priced at ₹4,999 only, which includes live sessions, real-world projects, placement support, and interview preparation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I get placement support after the Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Saanvi Careers provides dedicated placement support and interview preparation as part of the Gen AI Program.',
      },
    },
    {
      '@type': 'Question',
      name: 'What skills will I learn in the Gen AI Program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You will learn Generative AI fundamentals, large language models (LLMs), prompt engineering, real-world AI application development, and industry use cases.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AIProgram />
    </>
  );
}
