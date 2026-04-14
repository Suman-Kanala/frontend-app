'use client';

import { ReactNode, lazy, Suspense, CSSProperties } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';
import AuthToast from '@/components/AuthToast';

const AIChatbot = lazy(() => import('@/components/AIChatbot'));

function PageLoader(): JSX.Element {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#635bff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps): JSX.Element {
  const perspectiveStyle: CSSProperties = { perspective: '1000px' };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div
          className="min-h-screen bg-white dark:bg-[#060e1d] text-[#0a2540] dark:text-white overflow-x-hidden transition-colors duration-300"
          style={perspectiveStyle}
        >
          <Header />
          <main className="pt-16">
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </main>
          <Footer />
          <Toaster />
          <ScrollToTop />
          <AuthToast />
        </div>
        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}
