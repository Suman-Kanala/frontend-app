import nextDynamic from 'next/dynamic';
import { RoleRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const AdminCourses = nextDynamic(() => import('@/views/admin/AdminCourses'));

export default function AdminCoursesPage(): JSX.Element {
  return <RoleRoute roles={['admin', 'instructor']}><AdminCourses /></RoleRoute>;
}
