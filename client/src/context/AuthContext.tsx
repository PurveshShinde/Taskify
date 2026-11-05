import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { api, isDemoMode } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  isDemo: boolean;
  loginWithGoogle: () => Promise<void>;
  firebaseUser: FirebaseUser | null;
  updateUser: (user: User) => void;
}

export const DEMO_USER: User = {
  _id: 'demo-user-id',
  name: 'Demo User',
  email: 'demo@taskify.app',
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemo, setIsDemo] = useState<boolean>(() => isDemoMode());
  const [user, setUser] = useState<User | null>(() => {
    if (isDemoMode()) {
      return DEMO_USER;
    }
    const token = localStorage.getItem('taskify_token') || sessionStorage.getItem('taskify_token');
    const stored = localStorage.getItem('taskify_current_user');
    if (token && stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    // If demo mode is active, state is synchronously ready immediately
    return !isDemoMode();
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Sync with backend
        try {
          const token = await fbUser.getIdToken();
          const { user: appUser, token: appToken } = await api.auth.firebaseLogin(token);
          // If we had demo mode active, clear it when real user logs in
          sessionStorage.removeItem('is_demo_mode');
          localStorage.removeItem('is_demo_mode');
          setIsDemo(false);
          login(appToken, appUser);
        } catch (error) {
          console.error("Backend sync failed", error);
        }
      } else {
        // Only clear if NOT in demo mode
        if (!isDemoMode()) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (token: string, userData: User) => {
    sessionStorage.removeItem('is_demo_mode');
    localStorage.removeItem('is_demo_mode');
    setIsDemo(false);
    localStorage.setItem('taskify_token', token);
    localStorage.setItem('taskify_current_user', JSON.stringify(userData));
    setUser(userData);
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In failed", error);
      throw error;
    }
  };

  const loginAsDemo = async () => {
    sessionStorage.setItem('is_demo_mode', 'true');
    localStorage.setItem('is_demo_mode', 'true');
    sessionStorage.setItem('taskify_token', 'demo-token');
    localStorage.setItem('taskify_current_user', JSON.stringify(DEMO_USER));
    setIsDemo(true);
    setUser(DEMO_USER);
    setLoading(false);
  };

  const logout = async () => {
    sessionStorage.removeItem('is_demo_mode');
    localStorage.removeItem('is_demo_mode');
    sessionStorage.removeItem('taskify_token');
    localStorage.removeItem('taskify_token');
    localStorage.removeItem('taskify_current_user');
    setIsDemo(false);
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // Ignore signOut errors if not signed in to Firebase
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('taskify_current_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout, isDemo, loginWithGoogle, firebaseUser, updateUser }}>
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
