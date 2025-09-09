import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import MockAuthService from '../services/mockAuthService';

interface User {
  id: string;
  aadhaar: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'pilgrim' | 'authority' | 'admin';
  isVerified: boolean;
  passes?: any[];
  penalties?: any[];
  unreadNotifications?: number;
  bankAccount?: string;
}

interface AuthContextType {
  user: User | null;
  login: (aadhaar: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  language: 'en' | 'hi';
  toggleLanguage: () => void;
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
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const login = async (aadhaar: string): Promise<boolean> => {
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const isAuthenticated = user !== null;

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    language,
    toggleLanguage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};