import { Link } from "wouter";
import { LoginButton } from "../auth/login-button";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Bell, MessageSquare, Menu } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  // Initialize mobile menu as closed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.username?.substring(0, 2).toUpperCase() || "U";
  };

  const routes = [
    { name: "Discover", path: "/", icon: <MapPin className="h-4 w-4 mr-2" /> },
    { name: "Connections", path: "/connections", icon: <Users className="h-4 w-4 mr-2" /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: "Notifications", path: "/notifications", icon: <Bell className="h-4 w-4 mr-2" /> }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Desktop navbar
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur-lg">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold mr-10 flex items-center">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            SpotConnect
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 flex-1">
          {routes.map(route => (
            <Link 
              key={route.path} 
              href={route.path}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white dark:bg-black border-r z-50 w-64">
            <div className="px-2 py-6">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center mb-8">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                  SpotConnect
                </span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {routes.map(route => (
                  <Link 
                    key={route.path} 
                    href={route.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    {route.icon}
                    <span>{route.name}</span>
                  </Link>
                ))}
              </nav>
              {isAuthenticated && user && (
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/profile" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 p-3 mb-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.username || 'User'} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </span>
                  </Link>
                  <div className="px-3 mb-4">
                    <LoginButton 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                    />
                  </div>
                </div>
              )}
              {!isAuthenticated && (
                <div className="mt-8 pt-4 px-3 border-t border-gray-200 dark:border-gray-700">
                  <LoginButton 
                    variant="default" 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                  />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Desktop Right Side */}
        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.username || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.username || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.username}
                    </p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout">Sign Out</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton 
              className="hidden md:flex bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            />
          )}
        </div>
      </div>
    </header>
  );
}