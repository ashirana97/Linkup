import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

export interface ConnectionRequest {
  id: number;
  senderId: number;
  receiverId: number;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnhancedConnectionRequest extends ConnectionRequest {
  sender?: Partial<User>;
  receiver?: Partial<User>;
}

/**
 * Hook to fetch received connection requests for a user
 * @param userId - The user ID to get requests for
 */
export function useReceivedConnectionRequests(userId: number) {
  return useQuery({
    queryKey: [`/api/users/${userId}/connection-requests/received`],
    enabled: !!userId,
  });
}

/**
 * Hook to fetch sent connection requests for a user
 * @param userId - The user ID to get requests for
 */
export function useSentConnectionRequests(userId: number) {
  return useQuery({
    queryKey: [`/api/users/${userId}/connection-requests/sent`],
    enabled: !!userId,
  });
}

interface SendConnectionRequestInput {
  senderId: number;
  receiverId: number;
  message?: string;
}

/**
 * Hook to send a connection request (icebreaker/wave)
 */
export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: SendConnectionRequestInput) => {
      return apiRequest('/api/connection-requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${variables.senderId}/connection-requests/sent`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${variables.receiverId}/connection-requests/received`],
      });
    },
  });
}

interface UpdateConnectionRequestInput {
  requestId: number;
  status: 'accepted' | 'declined';
  senderId: number;
  receiverId: number;
}

/**
 * Hook to respond to a connection request (accept/decline)
 */
export function useRespondToConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status }: UpdateConnectionRequestInput) => {
      return apiRequest(`/api/connection-requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${variables.receiverId}/connection-requests/received`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/users/${variables.senderId}/connection-requests/sent`],
      });
      
      // If accepted, also invalidate conversations
      if (variables.status === 'accepted') {
        queryClient.invalidateQueries({
          queryKey: [`/api/users/${variables.receiverId}/conversations`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/api/users/${variables.senderId}/conversations`],
        });
      }
    },
  });
}

/**
 * Get time elapsed since connection request was created
 * 
 * @param dateString - Date string or Date object
 */
export function getTimeElapsed(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}