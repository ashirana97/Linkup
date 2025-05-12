import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@shared/schema';

// This is a public token specifically for demonstration purposes
// In a real app, you'd use an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrZHhzZ3I2bjE3bjQycnBnOTFvM2VoYzgifQ.WWOxh_N9vFOgDzuKGBHJQA';

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

export default function LocationMap({ 
  locations,
  selectedLocation,
  onLocationSelect,
  className = 'h-64 w-full rounded-lg overflow-hidden'
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  // San Francisco coordinates as default center
  const [center, setCenter] = useState<[number, number]>([-122.4194, 37.7749]);
  const [zoom] = useState(12);
  
  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom,
        interactive: true,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !locations.length) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Create dummy coordinates for demo purposes
    // In a real app, these would come from your database
    const dummyCoordinates: Record<number, [number, number]> = {
      1: [-122.4194, 37.7749], // Downtown Coffee Shop
      2: [-122.4284, 37.7694], // Central Library
      3: [-122.4314, 37.7904], // Tech Hub
      4: [-122.4064, 37.7825], // University Campus
      5: [-122.4194, 37.7649]  // Co-working Space
    };
    
    // Add markers for each location
    locations.forEach(location => {
      const coordinates = dummyCoordinates[location.id] || center;
      
      // Create a new DOM element for the marker
      const markerEl = document.createElement('div');
      markerEl.className = 'map-marker';
      markerEl.innerHTML = `
        <div class="${selectedLocation?.id === location.id 
          ? 'bg-primary text-white' 
          : 'bg-white text-gray-900'} 
          shadow-lg px-2 py-1 rounded-lg flex items-center justify-center
          font-medium text-sm cursor-pointer transition-all hover:scale-105">
          <i class="${location.icon || 'ri-map-pin-line'} mr-1"></i>
          ${location.name}
        </div>
      `;
      
      // Add click handler
      markerEl.addEventListener('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });
      
      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom'
      })
        .setLngLat(coordinates)
        .addTo(map.current!);
      
      markers.current.push(marker);
    });
    
    // Center map on selected location if available
    if (selectedLocation) {
      const selectedCoords = dummyCoordinates[selectedLocation.id] || center;
      map.current.flyTo({
        center: selectedCoords,
        zoom: 14,
        essential: true
      });
    }
  }, [locations, selectedLocation]);
  
  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}