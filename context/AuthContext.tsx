
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, isDemoMode } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check if we are in demo mode from previous session (unlikely due to flush requirement, but good for safety)
      if (isDemoMode()) {
          setIsDemo(true);
          // Re-login as demo to populate state
          const { user } = await api.auth.login('', ''); 
          setUser(user);
          setLoading(false);
          return;
      }

      try {
        const currentUser = api.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth init failed', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('taskify_token', token);
    setUser(userData);
  };

  const loginAsDemo = async () => {
    sessionStorage.setItem('is_demo_mode', 'true');
    setIsDemo(true);
    const { user } = await api.auth.login('demo', 'demo');
    setUser(user);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
