import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@shared/schema';
import { cn } from '@/lib/utils';

// Note: In a production environment, this would be set as an environment variable
// and a proper token would be obtained from Mapbox
// This is a placeholder token for demonstration purposes only
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNsa3FxcW1tb0AxMjMifQ.5oD9QYNmq0HDkKRQM2bh3g';

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
  className
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    // Default to San Francisco if no locations
    const defaultCenter = [-122.4194, 37.7749];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: defaultCenter,
      zoom: 12
    });
    
    map.current.on('load', () => {
      setMapInitialized(true);
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Add markers for each location
  useEffect(() => {
    if (!map.current || !mapInitialized || !locations.length) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for each location
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(location => {
      // For demo purposes, generate coordinates from location id
      // In a real app, these would come from the database
      const lng = -122.4194 + (location.id * 0.01);
      const lngLat = [lng, 37.7749] as [number, number];
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%236366f1\' width=\'36\' height=\'36\'%3E%3Cpath d=\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\'/%3E%3C/svg%3E")';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';
      
      // Highlight selected location
      if (selectedLocation && location.id === selectedLocation.id) {
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.zIndex = '10';
        el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%234f46e5\' width=\'36\' height=\'36\'%3E%3Cpath d=\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\'/%3E%3C/svg%3E")';
      }
      
      // Create popup with location info
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <strong>${location.name}</strong>
          <p class="text-sm">${location.address}</p>
          <p class="text-xs text-gray-500">${location.type}</p>
        </div>
      `);
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add click handler
      el.addEventListener('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });
      
      // Add to markers ref array for cleanup
      markers.current.push(marker);
      
      // Extend bounds to include this marker
      bounds.extend(lngLat);
    });
    
    // If we have locations, fit the map to show all markers
    if (locations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (locations.length === 1) {
      // If only one location, center on it
      const lng = -122.4194 + (locations[0].id * 0.01);
      map.current.setCenter([lng, 37.7749]);
      map.current.setZoom(14);
    }
    
  }, [locations, selectedLocation, mapInitialized, onLocationSelect]);
  
  // Center map on selected location
  useEffect(() => {
    if (!map.current || !mapInitialized || !selectedLocation) return;
    
    // For demo purposes, generate coordinates from location id
    const lng = -122.4194 + (selectedLocation.id * 0.01);
    map.current.flyTo({
      center: [lng, 37.7749],
      zoom: 14,
      essential: true
    });
  }, [selectedLocation, mapInitialized]);
  
  return (
    <div ref={mapContainer} className={cn("w-full h-full", className)}></div>
  );
}