'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface RoleRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoadingSpinner />;
  return <>{children}</>;
}

export function AdminRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/');
      } else if (user && !isAdmin) {
        router.replace('/dashboard');
      }
    }
  }, [loading, isAuthenticated, isAdmin, user, router]);

  if (loading || !isAuthenticated || !user) return <LoadingSpinner />;
  if (!isAdmin) return <LoadingSpinner />;
  return <>{children}</>;
}

export function RoleRoute({ children, roles = [] }: RoleRouteProps): JSX.Element {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/');
      } else if (user && !hasRole(...roles)) {
        router.replace('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || !user) return <LoadingSpinner />;
  if (!hasRole(...roles)) return <LoadingSpinner />;
  return <>{children}</>;
}

function LoadingSpinner(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
