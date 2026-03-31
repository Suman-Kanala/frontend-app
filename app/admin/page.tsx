import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminDashboard = nextDynamic(() => import('@/views/admin/AdminDashboard'));

export default function AdminPage(): JSX.Element {
  return <AdminRoute><AdminDashboard /></AdminRoute>;
}
