import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TabContent } from "@/components/ui/tab";
import LocationSelector from "@/components/discover/location-selector";
import InterestsFilter from "@/components/discover/interests-filter";
import UserCard from "@/components/discover/user-card";
import RecommendationsSection from "@/components/discover/recommendations-section";
import LocationMap from "@/components/map/location-map";
import { useCheckins } from "@/hooks/use-checkins";
import { useLocations } from "@/hooks/use-locations";
import { Location } from "@shared/schema";
import { Filter, Map, List, ChevronUp, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DiscoverTabProps {
  active: boolean;
}

const DiscoverTab = ({ active }: DiscoverTabProps) => {
  const [, setLocation] = useLocation();
  const { data: locations = [] } = useLocations();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(true);
  
  // Set default location when data is loaded
  useEffect(() => {
    if (locations && locations.length > 0 && !currentLocation) {
      setCurrentLocation(locations[0]);
    }
  }, [locations, currentLocation]);
  
  // Fetch check-ins for the selected location
  const { data: checkins, isLoading } = useCheckins(currentLocation?.id);
  
  // Filter check-ins by interest if selected
  const filteredCheckins = selectedInterest && checkins
    ? checkins.filter(checkin => 
        checkin.interests.some(interest => interest.name === selectedInterest)
      )
    : checkins;
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleConnect = (userId: number) => {
    // Send a message to initiate conversation
    console.log("Connecting with user:", userId);
    
    // Don't send a message if connecting with yourself
    if (userId === 1) {
      console.log("Cannot connect with yourself");
      setLocation(`/messages`);
      return;
    }
    
    // Use the API to send a message
    fetch(`/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: 1, // Current user ID (demo user)
        receiverId: userId,
        content: "Hi! I saw your check-in and wanted to connect." 
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Failed to send initial message");
        throw new Error("Failed to send message");
      }
    })
    .then(data => {
      console.log("Message sent successfully:", data);
      // Navigate to messages tab after connecting
      setLocation(`/messages`);
    })
    .catch(error => {
      console.error("Error sending message:", error);
    });
  };
  
  return (
    <TabContent id="discover" active={active}>
      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 bg-background pt-2 pb-3">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Discover</h1>
          <p className="text-sm text-gray-500">Find people around you</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setLocation("/checkin")}
            variant="default"
            size="sm"
            className="bg-primary text-white flex items-center whitespace-nowrap"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Check In
          </Button>
          <Button 
            onClick={toggleFilters}
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <Button 
            onClick={toggleViewMode}
            variant="outline" 
            size="sm"
            className="flex items-center"
          >
            {viewMode === 'list' ? 
              <><Map className="h-4 w-4 mr-1" /> Map</> : 
              <><List className="h-4 w-4 mr-1" /> List</>
            }
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="glass-card p-4 mb-4 space-y-4">
          <LocationSelector 
            currentLocation={currentLocation} 
            onLocationChange={setCurrentLocation}
          />
          
          <InterestsFilter 
            selectedInterest={selectedInterest}
            onSelectInterest={setSelectedInterest}
          />
        </div>
      )}
      
      {viewMode === 'map' && (
        <div className="mb-4 rounded-lg overflow-hidden h-[300px] shadow-md">
          <LocationMap 
            locations={locations}
            selectedLocation={currentLocation}
            onLocationSelect={setCurrentLocation}
            className="h-full w-full"
          />
        </div>
      )}
      
      {/* Recommendations section */}
      <RecommendationsSection 
        userId={1} // Current user ID (demo user)
        onConnect={handleConnect}
        onMessage={(userId) => {
          // Navigate to the messages tab with this user
          setLocation(`/messages`);
        }}
      />
      
      <Separator className="my-6" />
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold gradient-text mb-1">Active Check-ins</h2>
        <p className="text-sm text-gray-500">People currently checked in at this location</p>
      </div>
      
      <div className="user-cards-list space-y-4">
        {isLoading ? (
          // Loading state
          <>
            <div className="glass-card animate-pulse h-48"></div>
            <div className="glass-card animate-pulse h-48"></div>
          </>
        ) : filteredCheckins && filteredCheckins.length > 0 ? (
          // Render checkins
          filteredCheckins.map(checkin => (
            <UserCard 
              key={checkin.id} 
              checkin={checkin}
              onConnect={handleConnect}
            />
          ))
        ) : (
          // Empty state
          <div className="glass-card p-8 text-center">
            <p className="text-gray-500">
              {selectedInterest 
                ? `No one is checked in with interest in ${selectedInterest}` 
                : 'No one is checked in at this location'}
            </p>
            <Button
              variant="link"
              className="mt-3 text-primary font-medium"
              onClick={() => setSelectedInterest(null)}
            >
              {selectedInterest ? 'Clear filter' : 'Try another location'}
            </Button>
          </div>
        )}
      </div>
    </TabContent>
  );
};

export default DiscoverTab;
