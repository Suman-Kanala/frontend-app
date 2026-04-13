import { Metadata } from 'next';
import HomeClient from './home-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Saanvi Careers - Careers Connected | Professional Employment Services',
  description:
    'Saanvi Careers connects talent with opportunities across IT, Engineering, Healthcare, Finance sectors in India, USA, UK, Australia, EU and Gulf Countries. Professional employment services for job seekers and employers.',
  openGraph: {
    title: 'Saanvi Careers - Careers Connected',
    description:
      'Saanvi Careers connects top talent with transformative opportunities across IT, Engineering, Healthcare, and Finance — globally.',
    type: 'website',
    url: 'https://saanvicareers.com',
  },
  alternates: { canonical: 'https://saanvicareers.com' },
};

export default function HomePage(): JSX.Element {
  return <HomeClient />;
}
