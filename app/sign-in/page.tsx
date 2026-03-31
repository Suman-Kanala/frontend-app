import { Metadata } from 'next';
import SignInPage from '@/views/SignIn';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In - Saanvi Careers',
  description: 'Sign in to your Saanvi Careers account to access your courses and dashboard.',
};

export default SignInPage;
