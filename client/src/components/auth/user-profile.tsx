import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>You are not signed in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user.username?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImageUrl || undefined} alt={user.username || 'User'} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
            </CardTitle>
            {user.username && (
              <CardDescription className="text-lg">@{user.username}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {user.bio && (
          <div>
            <h3 className="font-medium text-lg mb-2">About</h3>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>
        )}
        
        {user.email && (
          <div>
            <h3 className="font-medium text-lg mb-2">Email</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        )}
        
        {user.location && (
          <div>
            <h3 className="font-medium text-lg mb-2">Location</h3>
            <p className="text-muted-foreground">{user.location}</p>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            variant="destructive" 
            onClick={() => window.location.href = "/api/logout"}
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}