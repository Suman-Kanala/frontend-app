'use client';

import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { store } from '@/store';

// Type augmentation for Clerk bug fix
declare global {
  interface Request {
    startsWith(...args: Parameters<String['startsWith']>): boolean;
  }
  interface URL {
    startsWith(...args: Parameters<String['startsWith']>): boolean;
  }
}

// Fix clerk-js v5 bug: error factory calls url.startsWith() on a Request/URL object
if (typeof Request !== 'undefined' && !(Request.prototype as any).startsWith) {
  (Request.prototype as any).startsWith = function (...args: Parameters<String['startsWith']>) {
    return (this as unknown as { url: string }).url.startsWith(...args);
  };
}
if (typeof URL !== 'undefined' && !(URL.prototype as any).startsWith) {
  (URL.prototype as any).startsWith = function (...args: Parameters<String['startsWith']>) {
    return (this as unknown as { href: string }).href.startsWith(...args);
  };
}

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ClerkProvider publishableKey={clerkPubKey}>
          {children}
        </ClerkProvider>
      </ThemeProvider>
    </Provider>
  );
}
