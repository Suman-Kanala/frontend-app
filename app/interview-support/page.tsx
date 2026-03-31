import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Interview Support - Saanvi Careers',
  description: 'Book a 1-on-1 interview coaching session with experienced professionals. Get job-ready fast.',
};

const InterviewSupport = nextDynamic(() => import('@/views/InterviewSupport'));

export default function InterviewSupportPage(): JSX.Element {
  return <ProtectedRoute><InterviewSupport /></ProtectedRoute>;
}
