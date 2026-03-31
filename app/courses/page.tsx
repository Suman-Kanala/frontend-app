import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import CoursesTopicsSection from '@/components/CoursesTopicsSection';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Courses - Saanvi Careers | Learn IT, AI & Engineering Skills',
  description:
    'Browse expert-curated courses in Generative AI, Full Stack Development, Data Science and more. Hands-on projects, placement support, and industry mentorship.',
  openGraph: {
    title: 'Courses - Saanvi Careers',
    description: 'Explore our course catalog and accelerate your tech career.',
    type: 'website',
    url: 'https://saanvicareers.com/courses',
  },
  alternates: { canonical: 'https://saanvicareers.com/courses' },
};

const Courses = dynamic(() => import('@/views/Courses'));

export default function CoursesPage(): JSX.Element {
  return (
    <>
      <Courses />
      <CoursesTopicsSection />
    </>
  );
}
