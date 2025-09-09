import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'pilgrim' | 'authority' | 'admin';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated } = useAuth();

  console.log('🛡️ ProtectedRoute:', {
    isAuthenticated,
    user: user?.name,
    userRole: user?.role,
    requiredRole,
    fallbackPath
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If specific role required, check it
  if (requiredRole && user.role !== requiredRole) {
    console.log(`❌ ProtectedRoute: Wrong role. Required: ${requiredRole}, User has: ${user.role}`);
    
    // Redirect based on user's actual role
    if (user.role === 'authority' || user.role === 'admin') {
      console.log('🔄 ProtectedRoute: Authority user, redirecting to authority dashboard');
      return <Navigate to="/authority" replace />;
    } else {
      console.log('🔄 ProtectedRoute: Pilgrim user, redirecting to pilgrim portal');
      return <Navigate to="/pilgrim" replace />;
    }
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
