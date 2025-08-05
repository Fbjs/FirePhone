'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    const storedUser = localStorage.getItem('communicate-easy-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const mockUser: User = { uid: '123', email };
        setUser(mockUser);
        localStorage.setItem('communicate-easy-user', JSON.stringify(mockUser));
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const signup = async (email: string, pass: string): Promise<void> => {
     // In a real app, this would create a new user. Here it just logs in.
    return login(email, pass);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('communicate-easy-user');
    router.push('/login');
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
