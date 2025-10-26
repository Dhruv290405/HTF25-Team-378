import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import i18n from '@/i18n';
import MockAuthService from '../services/mockAuthService';

interface User {
  id: string;
  aadhaar: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'pilgrim' | 'authority' | 'admin';
  isVerified: boolean;
  passes?: unknown[];
  penalties?: unknown[];
  unreadNotifications?: number;
  bankAccount?: string;
}

interface AuthContextType {
  user: User | null;
  login: (aadhaar: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  language: 'en' | 'hi' | 'te';
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>(() => {
    const stored = localStorage.getItem('lang');
    return (stored as 'en' | 'hi' | 'te') || 'en';
  });

  const login = useCallback(async (aadhaar: string): Promise<boolean> => {
    try {
      console.log('🔐 AuthContext: Attempting login with Aadhaar:', aadhaar);
      const authenticatedUser = await MockAuthService.authenticateUser(aadhaar);
      
      if (authenticatedUser && authenticatedUser.isVerified) {
        const user: User = {
          id: authenticatedUser.id,
          aadhaar: authenticatedUser.aadhaar,
          name: authenticatedUser.name,
          mobile: authenticatedUser.mobile,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          isVerified: authenticatedUser.isVerified,
          passes: authenticatedUser.passes || [],
          penalties: authenticatedUser.penalties || [],
          unreadNotifications: authenticatedUser.unreadNotifications || 0,
          bankAccount: authenticatedUser.bankAccount
        };
        
        console.log('✅ AuthContext: Login successful, setting user:', user.name, `(${user.role})`);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      console.log('❌ AuthContext: Login failed - invalid user or not verified');
      return false;
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : prev === 'hi' ? 'te' : 'en');
  }, []);

  // Keep i18n in sync with our context language and persist choice
  useEffect(() => {
    try {
      // Only change language if it's different to avoid loops
      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
      localStorage.setItem('lang', language);
    } catch (e) {
      console.error('Failed to change i18n language:', e);
    }
  }, [language]);

  const isAuthenticated = user !== null;

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated,
    language,
    toggleLanguage,
    setLanguage,
  }), [user, login, logout, isAuthenticated, language, toggleLanguage]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};