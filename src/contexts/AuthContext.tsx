'use client';

import React, { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { setTokenGetter } from '@/lib/api';
import { useSyncAuthMutation } from '@/store/api/appApi';
import { getErrorMessage } from '@/store/api/baseQuery';

interface DbUser {
  _id?: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: DbUser | null;
  clerkUser: any;
  role: string;
  isAdmin: boolean;
  isInstructor: boolean;
  isStaff: boolean;
  hasRole: (...roles: string[]) => boolean;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { isSignedIn, isLoaded: userLoaded, user: clerkUser } = useUser();
  const { getToken, isLoaded: authLoaded } = useClerkAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [syncAuth] = useSyncAuthMutation();

  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const clerkLoaded = userLoaded && authLoaded;
  const isAuthenticated = !!isSignedIn;

  // Wire up token getter for api client
  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(() => getToken());
    } else {
      setTokenGetter(null);
    }
  }, [isAuthenticated, getToken]);

  // Sync user to backend after login
  const syncUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !clerkUser) return;
    setSyncing(true);
    try {
      const data = await syncAuth({
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || '',
        picture: clerkUser.imageUrl || '',
      }).unwrap();
      setDbUser(data);
      setSynced(true);
    } catch (err) {
      console.error('User sync failed:', getErrorMessage(err, 'Failed to sync user'));
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, clerkUser, syncAuth]);

  useEffect(() => {
    if (clerkLoaded && isAuthenticated && clerkUser && !synced) {
      syncUser();
    }
    if (clerkLoaded && !isAuthenticated) {
      setDbUser(null);
      setSynced(false);
    }
  }, [clerkLoaded, isAuthenticated, clerkUser, synced, syncUser]);

  function login(): void {
    router.push('/sign-in');
  }

  function logout(): void {
    setDbUser(null);
    setSynced(false);
    signOut(() => router.push('/'));
  }

  const role = (dbUser?.role as string) || 'student';
  const isAdmin = role === 'admin';
  const isInstructor = role === 'instructor';
  const isStaff = isAdmin || isInstructor;
  const loading = !clerkLoaded || (isAuthenticated && !synced && syncing);

  function hasRole(...roles: string[]): boolean {
    return roles.includes(role);
  }

  const contextValue: AuthContextType = {
    isAuthenticated,
    loading,
    user: dbUser,
    clerkUser,
    role,
    isAdmin,
    isInstructor,
    isStaff,
    hasRole,
    login,
    logout,
    getToken,
    refreshUser: syncUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
