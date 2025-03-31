import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          console.log("Auth state changed:", event, !!session);
          setIsAuthenticated(!!session);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log("Initial session check:", !!session);
        setIsAuthenticated(!!session);
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="animate-pulse-glow w-16 h-16 rounded-full bg-cancer-blue/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-cancer-blue/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
