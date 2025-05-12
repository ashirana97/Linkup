import { useAuth } from "../../hooks/useAuth";
import { useLocation, Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="p-8 w-full">
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-2/3 h-8 mb-4" />
        <Skeleton className="w-1/2 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with a returnTo parameter
    const redirectPath = `${redirectTo}?returnTo=${encodeURIComponent(location)}`;
    return <Redirect to={redirectPath} />;
  }

  return <>{children}</>;
}