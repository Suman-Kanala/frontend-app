import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminPayments = nextDynamic(() => import('@/views/admin/AdminPayments'));

export default function AdminPaymentsPage(): JSX.Element {
  return <AdminRoute><AdminPayments /></AdminRoute>;
}
