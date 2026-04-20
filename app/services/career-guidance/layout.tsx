import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Guidance Session – 1-on-1 Expert Mentorship | Saanvi Careers',
  description:
    'Book a personalised 30-minute career guidance session with industry experts at ₹499. Get a career roadmap, resume review, salary negotiation tips, and interview preparation. Trusted by 500+ professionals.',
  keywords: [
    'career guidance India', 'career counselling India', 'career mentorship',
    'career coaching India', '1-on-1 career session', 'career advice India',
    'salary negotiation tips India', 'resume review India', 'career roadmap India',
  ],
  alternates: { canonical: 'https://saanvicareers.com/services/career-guidance' },
  openGraph: {
    title: 'Career Guidance Session – 1-on-1 Expert Mentorship | Saanvi Careers',
    description: 'Book a 30-minute 1-on-1 career guidance session at ₹499. Career roadmap, resume review, salary tips.',
    url: 'https://saanvicareers.com/services/career-guidance',
    type: 'website',
    images: [{ url: 'https://saanvicareers.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function CareerGuidanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
