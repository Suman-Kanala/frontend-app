'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallback() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
