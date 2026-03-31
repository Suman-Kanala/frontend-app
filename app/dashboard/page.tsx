import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Dashboard - Saanvi Careers',
  description: 'View your enrolled courses, track progress, and manage payments.',
};

const Dashboard = nextDynamic(() => import('@/views/Dashboard'));

export default function DashboardPage(): JSX.Element {
  return <ProtectedRoute><Dashboard /></ProtectedRoute>;
}
