import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TabContent } from "@/components/ui/tab";
import LocationSelector from "@/components/discover/location-selector";
import InterestsFilter from "@/components/discover/interests-filter";
import UserCard from "@/components/discover/user-card";
import { useCheckins } from "@/hooks/use-checkins";
import { useLocations } from "@/hooks/use-locations";
import { Location } from "@shared/schema";
import { Filter } from "lucide-react";

interface DiscoverTabProps {
  active: boolean;
}

const DiscoverTab = ({ active }: DiscoverTabProps) => {
  const [, setLocation] = useLocation();
  const { data: locations } = useLocations();
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  
  // Set default location when data is loaded
  useEffect(() => {
    if (locations && locations.length > 0 && !currentLocation) {
      setCurrentLocation(locations[0]);
    }
  }, [locations, currentLocation]);
  
  // Fetch check-ins for the selected location
  const { data: checkins, isLoading } = useCheckins(currentLocation?.id);
  
  console.log("Current location:", currentLocation?.id, "Checkins:", checkins);
  
  // Filter check-ins by interest if selected
  const filteredCheckins = selectedInterest && checkins
    ? checkins.filter(checkin => 
        checkin.interests.some(interest => interest.name === selectedInterest)
      )
    : checkins;
  
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
          <p className="text-sm text-gray-500">Find people around you</p>
        </div>
        <button className="bg-primary hover:bg-opacity-90 text-white rounded-full p-2">
          <Filter className="w-5 h-5" />
        </button>
      </div>
      
      <LocationSelector 
        currentLocation={currentLocation} 
        onLocationChange={setCurrentLocation}
      />
      
      <InterestsFilter 
        selectedInterest={selectedInterest}
        onSelectInterest={setSelectedInterest}
      />
      
      <div className="user-cards-list space-y-4">
        {isLoading ? (
          // Loading state
          <>
            <div className="bg-white rounded-lg shadow animate-pulse h-48"></div>
            <div className="bg-white rounded-lg shadow animate-pulse h-48"></div>
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
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              {selectedInterest 
                ? `No one is checked in with interest in ${selectedInterest}` 
                : 'No one is checked in at this location'}
            </p>
            <button
              className="mt-3 text-primary font-medium"
              onClick={() => setSelectedInterest(null)}
            >
              {selectedInterest ? 'Clear filter' : 'Try another location'}
            </button>
          </div>
        )}
      </div>
    </TabContent>
  );
};

export default DiscoverTab;
