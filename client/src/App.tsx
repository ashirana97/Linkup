import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import CheckInButton from "@/components/discover/check-in-button";

function Router() {
  const [location] = useLocation();
  
  // Don't show the floating check-in button on the check-in page to avoid overlapping with form elements
  const isCheckInPage = location === "/checkin";
  
  return (
    <>
      {!isCheckInPage && <CheckInButton />}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/checkin" component={Home} />
        <Route path="/messages" component={Home} />
        <Route path="/profile" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </>
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
