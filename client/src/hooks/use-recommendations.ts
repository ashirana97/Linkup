import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Interest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Define the recommendation interface
export interface UserRecommendation {
  user: Omit<User, 'password'>;
  similarityScore: string;
  sharedInterests: Interest[];
  totalSharedInterests: number;
}

/**
 * Hook to fetch user recommendations based on shared interests
 * 
 * @param userId - The user ID to get recommendations for
 * @returns Query result with user recommendations sorted by similarity
 */
export function useUserRecommendations(userId: number) {
  return useQuery<UserRecommendation[]>({
    queryKey: [`/api/users/${userId}/recommendations`],
    enabled: !!userId,
  });
}

/**
 * Hook to add an interest to a user's profile  
 * This can be used to improve recommendations over time
 */
export function useAddUserInterest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, interestId }: { userId: number; interestId: number }) => {
      const res = await apiRequest('POST', `/api/users/${userId}/interests`, { interestId });
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate recommendations and user interests
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.userId}/recommendations`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.userId}`] 
      });
    }
  });
}

/**
 * Hook to calculate match percentage from similarity score
 * 
 * @param similarityScore - Similarity score from 0 to 1
 * @returns A formatted percentage string
 */
export function getMatchPercentage(similarityScore: string): string {
  // Convert the similarity score (0-1) to a percentage
  const percentage = Math.round(parseFloat(similarityScore) * 100);
  return `${percentage}%`;
}