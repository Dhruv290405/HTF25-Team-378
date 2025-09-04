import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  mobile: string;
  aadhaar: string;
  role: 'pilgrim' | 'authority';
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, role: 'pilgrim' | 'authority') => void;
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

  const login = (mobile: string, role: 'pilgrim' | 'authority') => {
    // Mock authentication
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: role === 'pilgrim' ? 'राम शर्मा' : 'Admin Officer',
      mobile: mobile,
      aadhaar: '1234-5678-9012',
      role: role
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

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