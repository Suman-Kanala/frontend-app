import { redirect } from 'next/navigation';

// Dashboard was removed — redirect to home
export default function DashboardPage() {
  redirect('/');
}
