import { useQuery } from "@tanstack/react-query";
import { Location } from "@shared/schema";

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ['/api/locations'],
  });
}

export function useLocation(locationId: number) {
  return useQuery<Location>({
    queryKey: [`/api/locations/${locationId}`],
    enabled: !!locationId,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ['/api/activities'],
  });
}

export function useInterests() {
  return useQuery({
    queryKey: ['/api/interests'],
  });
}
