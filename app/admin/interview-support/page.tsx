import nextDynamic from 'next/dynamic';
import { AdminRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminInterviewSupport = nextDynamic(() => import('@/views/admin/AdminInterviewSupport'));

export default function AdminInterviewSupportPage(): JSX.Element {
  return <AdminRoute><AdminInterviewSupport /></AdminRoute>;
}
