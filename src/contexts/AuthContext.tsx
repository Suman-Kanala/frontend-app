'use client';

import { ReactNode, createContext, useContext } from 'react';

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
  const value: AuthContextType = {
    isAuthenticated: false,
    loading: false,
    user: null,
    role: 'student',
    isAdmin: false,
    isInstructor: false,
    isStaff: false,
    hasRole: () => false,
    login: () => {},
    logout: () => {},
    getToken: async () => null,
    refreshUser: async () => {},
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
