import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATS Resume Builder – Professional Resume Optimisation | Saanvi Careers',
  description:
    'Build an ATS-optimised resume that bypasses filters and gets you shortlisted. Upload your resume, enter your target role, and get 3 professional variants instantly. Free to use. PDF & Word supported.',
  keywords: [
    'ATS resume builder India', 'ATS optimised resume', 'resume builder India',
    'professional resume writing India', 'resume optimisation India',
    'ATS friendly resume', 'free resume builder India',
  ],
  alternates: { canonical: 'https://saanvicareers.com/services/ats-resume' },
  openGraph: {
    title: 'ATS Resume Builder – Professional Resume Optimisation | Saanvi Careers',
    description: 'Build an ATS-optimised resume that bypasses filters. 3 professional variants. Free to use.',
    url: 'https://saanvicareers.com/services/ats-resume',
    type: 'website',
    images: [{ url: 'https://saanvicareers.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function ATSResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
