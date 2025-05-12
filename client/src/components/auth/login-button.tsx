import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  className?: string;
}

export function LoginButton({ 
  variant = "default", 
  size = "default",
  className = ""
}: LoginButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Button is disabled while checking auth
  if (isLoading) {
    return (
      <Button 
        variant={variant || "default"} 
        size={size || "default"} 
        className={className}
        disabled
      >
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  // Show logout button if authenticated
  if (isAuthenticated) {
    return (
      <Button
        variant={variant || "default"}
        size={size || "default"}
        className={className}
        onClick={() => window.location.href = "/api/logout"}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  // Show login button if not authenticated
  return (
    <Button
      variant={variant || "default"}
      size={size || "default"}
      className={className}
      onClick={() => window.location.href = "/api/login"}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
}