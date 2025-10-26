import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
// Import i18n configuration
import '@/i18n';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import("@/pages/LandingPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const AuthorityDashboard = React.lazy(() => import("@/pages/AuthorityDashboard"));
const PilgrimPortal = React.lazy(() => import("@/pages/PilgrimPortal"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-muted-foreground">Loading TRINETRA...</p>
      <p className="text-sm text-muted-foreground">Smart Crowd Management System</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/authority" 
                      element={
                        <ProtectedRoute requiredRole="authority">
                          <AuthorityDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/pilgrim" 
                      element={
                        <ProtectedRoute requiredRole="pilgrim">
                          <PilgrimPortal />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Catch all route */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;