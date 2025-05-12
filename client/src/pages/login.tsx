import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Get the return URL from the query string if it exists
  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get("returnTo") || "/";
  
  // If user is already authenticated, redirect to return URL
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation(returnTo);
    }
  }, [isAuthenticated, isLoading, returnTo, setLocation]);
  
  const handleLogin = () => {
    // Store the return URL in localStorage before redirecting to login
    if (returnTo) {
      localStorage.setItem("authReturnTo", returnTo);
    }
    window.location.href = "/api/login";
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background/60 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Welcome to SpotConnect
          </CardTitle>
          <CardDescription>
            Sign in to connect with people at your favorite locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to discover people with shared interests at your location
            </p>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={handleLogin}
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Replit
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}