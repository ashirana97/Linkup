import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Checkin } from "@shared/schema";
import { CheckinWithDetails } from "@/lib/types";

export function useCheckins(locationId?: number) {
  const url = locationId 
    ? `/api/checkins?locationId=${locationId}` 
    : '/api/checkins';

  return useQuery<CheckinWithDetails[]>({
    queryKey: ['/api/checkins', locationId?.toString()],
  });
}

export function useUserCheckins(userId: number) {
  return useQuery<CheckinWithDetails[]>({
    queryKey: [`/api/users/${userId}/checkins`],
  });
}

interface CheckinInput {
  userId: number;
  locationId: number;
  activityId: number;
  note?: string;
  duration: string; // in hours
  interestIds?: number[];
}

export function useCreateCheckin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkinData: CheckinInput) => {
      const res = await apiRequest('POST', '/api/checkins', checkinData);
      return res.json() as Promise<CheckinWithDetails>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/checkins'] });
    },
  });
}

export function useDeactivateCheckin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkinId: number) => {
      const res = await apiRequest('POST', `/api/checkins/${checkinId}/deactivate`, {});
      return res.json() as Promise<Checkin>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/checkins'] });
    },
  });
}

export function getTimeSince(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'year' : 'years'} ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'month' : 'months'} ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'day' : 'days'} ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'hour' : 'hours'} ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} ${interval === 1 ? 'min' : 'mins'} ago`;
  }
  
  return 'Just now';
}
