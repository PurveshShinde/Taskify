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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Sync with backend
        try {
          const token = await fbUser.getIdToken();
          const { user: appUser, token: appToken } = await api.auth.firebaseLogin(token);
          login(appToken, appUser);
        } catch (error) {
          console.error("Backend sync failed", error);
          // If backend sync fails (e.g. unverified email), force logout from firebase too or handle gracefully
          // For now, we keep firebase user but app user is null
        }
      } else {
        // Only clear if not in demo mode
        if (!isDemo) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  // Demo Mode Persistence
  useEffect(() => {
    if (isDemoMode()) {
      setIsDemo(true);
      api.auth.login('', '').then(({ user }) => {
        setUser(user);
        setLoading(false);
      });
    }
  }, []);


  const login = (token: string, userData: User) => {
    localStorage.setItem('taskify_token', token);
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
    setIsDemo(true);
    const { user } = await api.auth.login('demo', 'demo');
    setUser(user);
  };

  const logout = async () => {
    if (isDemo) {
      sessionStorage.removeItem('is_demo_mode');
      setIsDemo(false);
      setUser(null);
    } else {
      await signOut(auth);
      localStorage.removeItem('taskify_token');
      setUser(null);
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
