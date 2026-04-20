import { redirect } from 'next/navigation';

// AI Program was removed — redirect to services
export default function AIProgramPage() {
  redirect('/services/ats-resume');
}
