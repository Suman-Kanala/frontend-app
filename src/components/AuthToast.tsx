'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';

export default function AuthToast() {
  const { user, isLoaded, isSignedIn } = useUser();
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const prev = prevSignedIn.current;

    // Just signed in
    if (prev === false && isSignedIn === true) {
      const name = user?.firstName ?? user?.fullName?.split(' ')[0] ?? null;
      toast({
        title: name ? `Welcome back, ${name}!` : 'Welcome back!',
        description: 'You are now signed in.',
        duration: 4000,
      });
    }

    prevSignedIn.current = isSignedIn ?? false;
  }, [isLoaded, isSignedIn, user]);

  return null;
}
