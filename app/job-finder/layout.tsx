import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'AI Job Finder – Get Matched to Your Dream Job | Saanvi Careers',
  description:
    'Upload your resume and let our AI instantly match you with the best job opportunities across IT, Engineering, Healthcare and Finance globally. Get personalized job recommendations in seconds.',
  keywords: [
    'AI job finder', 'job matching tool', 'upload resume get jobs', 'IT jobs India',
    'engineering jobs', 'healthcare jobs', 'finance jobs', 'job search India',
    'AI powered job search', 'job matcher', 'find jobs online India',
  ],
  openGraph: {
    title: 'AI Job Finder – Get Matched to Your Dream Job | Saanvi Careers',
    description:
      'AI-powered job matching. Upload your resume and get matched to the best open roles in IT, Engineering, Healthcare and Finance globally.',
    type: 'website',
    url: 'https://saanvicareers.com/job-finder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saanvi Careers AI Job Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Job Finder – Saanvi Careers',
    description: 'AI-powered job matching. Upload resume, get matched with top jobs globally.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://saanvicareers.com/job-finder' },
};

const jobFinderSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://saanvicareers.com/job-finder#webpage',
  name: 'AI Job Finder – Saanvi Careers',
  url: 'https://saanvicareers.com/job-finder',
  description:
    'AI-powered job matching tool by Saanvi Careers. Upload your resume to get instantly matched with jobs across IT, Engineering, Healthcare and Finance sectors.',
  isPartOf: { '@id': 'https://saanvicareers.com/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://saanvicareers.com' },
      { '@type': 'ListItem', position: 2, name: 'Job Finder', item: 'https://saanvicareers.com/job-finder' },
    ],
  },
};

export default function JobFinderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobFinderSchema) }}
      />
      {children}
    </>
  );
}
