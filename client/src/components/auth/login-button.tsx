import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, LogOut } from "lucide-react";

interface LoginButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LoginButton({ variant = "default", size = "default", className }: LoginButtonProps) {
  const { isAuthenticated } = useAuth();

  const handleAuth = () => {
    if (isAuthenticated) {
      // Redirect to logout endpoint
      window.location.href = "/api/logout";
    } else {
      // Redirect to login endpoint
      window.location.href = "/api/login";
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleAuth}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </>
      )}
    </Button>
  );
}