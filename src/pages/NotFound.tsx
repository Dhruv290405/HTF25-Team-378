import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center max-w-md mx-auto px-4">
        <img 
          src="/trinetra-logo.svg" 
          alt="TRINETRA Logo" 
          className="w-24 h-24 mx-auto mb-6 opacity-80"
        />
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gradient mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist in the TRINETRA system.
        </p>
        <div className="space-y-3">
          <a 
            href="/" 
            className="block w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </a>
          <div className="flex space-x-2">
            <a 
              href="/login" 
              className="flex-1 border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Login
            </a>
            <a 
              href="/pilgrim" 
              className="flex-1 border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Pilgrim Portal
            </a>
            <a 
              href="/authority" 
              className="flex-1 border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/10 transition-colors text-sm"
            >
              Authority Dashboard
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          TRINETRA - Smart Crowd Management System
        </p>
      </div>
    </div>
  );
};

export default NotFound;
