'use client';

import { SignUp } from '@clerk/nextjs';
import Logo from '@/components/Logo';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] dark:bg-[#060e1d] flex flex-col items-center justify-center px-4 py-16">
      <div className="flex justify-center mb-8">
        <Logo size="default" />
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: '#635bff',
            colorBackground: '#ffffff',
            colorText: '#0a2540',
            colorInputBackground: '#ffffff',
            colorInputText: '#0a2540',
            borderRadius: '0.75rem',
            fontFamily: 'var(--font-inter)',
          },
          elements: {
            card: 'shadow-sm shadow-black/5 border border-[#E6EBF1]',
            headerTitle: 'text-xl font-extrabold text-[#0a2540] tracking-tight',
            headerSubtitle: 'text-sm text-[#697386]',
            formButtonPrimary: 'bg-[#635bff] hover:bg-[#4f46e5] text-sm font-semibold',
            footerActionLink: 'text-[#635bff] font-semibold hover:text-[#4f46e5]',
            socialButtonsBlockButton: 'border border-[#E6EBF1] text-sm font-semibold',
            footer: 'hidden',
          },
          layout: {
            socialButtonsPlacement: 'top',
          },
        }}
      />
    </div>
  );
}
