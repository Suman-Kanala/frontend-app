import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminActivity = nextDynamic(() => import('@/views/admin/AdminActivity'));

export default function AdminActivityPage(): JSX.Element {
  return <AdminRoute><AdminActivity /></AdminRoute>;
}
