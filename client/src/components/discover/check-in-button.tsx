import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

/**
 * Floating check-in button component that's always visible
 * regardless of scroll position
 */
export default function CheckInButton() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Button
        onClick={() => setLocation("/checkin")}
        variant="default"
        size="lg"
        className="bg-primary text-white flex items-center rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <MapPin className="h-5 w-5 mr-2" />
        Check In
      </Button>
    </div>
  );
}