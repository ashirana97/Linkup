import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import ProfilePage from "@/pages/profile";
import { ProtectedRoute } from "@/components/auth/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/checkin">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/connections">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/messages">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/notifications">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
