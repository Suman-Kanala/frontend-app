'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={32} className="animate-spin text-[#635bff] mx-auto mb-3" />
        <p className="text-sm text-[#697386] dark:text-[#8898aa]">Completing sign in…</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
