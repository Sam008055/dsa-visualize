import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
