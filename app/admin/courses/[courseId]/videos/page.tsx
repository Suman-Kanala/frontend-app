import nextDynamic from 'next/dynamic';
import { RoleRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminVideos = nextDynamic(() => import('@/views/admin/AdminVideos'));

export default function AdminVideosPage(): JSX.Element {
  return <RoleRoute roles={['admin', 'instructor']}><AdminVideos /></RoleRoute>;
}
