'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/nextjs';

/* The admin email — always granted admin role regardless of metadata */
const ADMIN_EMAIL = 'kanalasuman1@gmail.com';

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
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();

  const email    = user?.primaryEmailAddress?.emailAddress ?? '';
  const metadata = user?.publicMetadata as Record<string, string> | undefined;
  const role     = metadata?.role || (email === ADMIN_EMAIL ? 'admin' : 'student');

  const dbUser: DbUser | null = user
    ? {
        email,
        name:    user.fullName ?? user.firstName ?? '',
        picture: user.imageUrl,
        role,
      }
    : null;

  const value: AuthContextType = {
    isAuthenticated: isSignedIn ?? false,
    loading:         !isLoaded,
    user:            dbUser,
    role,
    isAdmin:         role === 'admin' || email === ADMIN_EMAIL,
    isInstructor:    role === 'instructor',
    isStaff:         ['admin', 'staff', 'instructor'].includes(role) || email === ADMIN_EMAIL,
    hasRole:         (...roles: string[]) => roles.includes(role),
    login:           () => {},   // Clerk handles via SignInButton / redirect
    logout:          () => { signOut(); },
    getToken:        async () => getToken(),
    refreshUser:     async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
