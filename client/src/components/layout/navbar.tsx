import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LoginButton } from "../auth/login-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, MessageCircle, User, LogOut } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.username?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              SpotConnect
            </span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/">
              <span className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                location === "/" ? "text-primary" : "text-muted-foreground"
              )}>
                Discover
              </span>
            </Link>
            <Link href="/checkin">
              <span className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                location === "/checkin" ? "text-primary" : "text-muted-foreground"
              )}>
                Check-in
              </span>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/messages">
                  <span className={cn(
                    "text-sm font-medium hover:text-primary transition-colors",
                    location === "/messages" ? "text-primary" : "text-muted-foreground"
                  )}>
                    Messages
                  </span>
                </Link>
                <Link href="/profile">
                  <span className={cn(
                    "text-sm font-medium hover:text-primary transition-colors",
                    location === "/profile" ? "text-primary" : "text-muted-foreground"
                  )}>
                    Profile
                  </span>
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <LoginButton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.username || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.firstName && user?.lastName && (
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    )}
                    {user?.username && (
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/checkin">
                    <div className="flex items-center cursor-pointer w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Check-in</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">
                    <div className="flex items-center cursor-pointer w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="flex items-center cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 hover:text-red-500 cursor-pointer"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}