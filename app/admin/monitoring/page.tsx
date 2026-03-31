import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminMonitoring = nextDynamic(() => import('@/views/admin/AdminMonitoring'));

export default function AdminMonitoringPage(): JSX.Element {
  return <AdminRoute><AdminMonitoring /></AdminRoute>;
}
