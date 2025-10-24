import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './useAuth';

interface AuthContextValue extends ReturnType<typeof useAuth> {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const value = useMemo(() => auth, [auth.user, auth.isAuthenticated, auth.isLoading, auth.error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
