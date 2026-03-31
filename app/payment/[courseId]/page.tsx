import nextDynamic from 'next/dynamic';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

const Payment = nextDynamic(() => import('@/views/Payment'));

export default function PaymentPage(): JSX.Element {
  return <ProtectedRoute><Payment /></ProtectedRoute>;
}
