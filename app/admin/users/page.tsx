import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminUsers = nextDynamic(() => import('@/views/admin/AdminUsers'));

export default function AdminUsersPage(): JSX.Element {
  return <AdminRoute><AdminUsers /></AdminRoute>;
}
