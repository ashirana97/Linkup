import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { LogIn } from "lucide-react";
import { Layout } from "@/components/layout/layout";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  // Handle login button click
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Show login page if not authenticated
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 bg-gradient-to-b from-background to-secondary/20">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Welcome to SpotConnect
            </CardTitle>
            <CardDescription className="text-lg">
              Sign in to connect with people around you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-center text-muted-foreground">
                Using SpotConnect, you can check-in at your current location and discover people with similar interests nearby.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Ready to connect?</h3>
                <p className="text-sm text-muted-foreground">Click the button below to sign in and get started.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              onClick={handleLogin}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}