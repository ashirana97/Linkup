import { useState } from "react";
import { useLocations } from "@/hooks/use-locations";
import { Location } from "@shared/schema";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  currentLocation: Location | undefined;
  onLocationChange: (location: Location) => void;
}

const LocationSelector = ({
  currentLocation,
  onLocationChange
}: LocationSelectorProps) => {
  const { data: locations, isLoading } = useLocations();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4 animate-pulse">
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="text-primary mr-2" />
          <div>
            <span className="text-sm text-gray-500">Current Location</span>
            <h2 className="font-semibold text-gray-800">
              {currentLocation ? currentLocation.name : 'Select a location'}
            </h2>
          </div>
        </div>
        <button 
          className="text-primary font-medium"
          onClick={() => setShowLocationPicker(!showLocationPicker)}
        >
          Change
        </button>
      </div>
      
      {showLocationPicker && locations && locations.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-2 text-gray-700">Select Location</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {locations.map(location => (
              <div 
                key={location.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  onLocationChange(location);
                  setShowLocationPicker(false);
                }}
              >
                <i className={`${location.icon} text-xl text-primary mr-3`}></i>
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-xs text-gray-500">{location.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
