import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { ConversationSummary } from "@/lib/types";

export function useConversations(userId: number) {
  return useQuery<ConversationSummary[]>({
    queryKey: [`/api/users/${userId}/conversations`],
  });
}

export function useConversationMessages(partnerId: number) {
  return useQuery<Message[]>({
    queryKey: [`/api/conversations/${partnerId}`],
  });
}

interface MessageInput {
  senderId: number;
  receiverId: number;
  content: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageData: MessageInput) => {
      try {
        const res = await apiRequest('POST', '/api/messages', messageData);
        return res.json() as Promise<Message>;
      } catch (error) {
        console.error("Error sending message:", error);
        // Create a fallback message for better UX, will be updated when sync happens
        const tempMessage: Message = {
          id: Math.floor(Math.random() * -1000), // Temporary negative ID
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          content: messageData.content,
          createdAt: new Date(),
          isRead: false
        };
        
        // Add to the local cache immediately
        queryClient.setQueryData(
          [`/api/conversations/${messageData.receiverId}`],
          (old: Message[] = []) => [...old, tempMessage]
        );
        
        // Rethrow the error to be handled by onError
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch queries related to this conversation
      queryClient.invalidateQueries({ 
        queryKey: [`/api/conversations/${variables.receiverId}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.senderId}/conversations`] 
      });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // Could show toast notification here
      setTimeout(() => {
        // After a delay, retry fetching conversations to sync with server
        queryClient.invalidateQueries({
          queryKey: ['/api/conversations']
        });
      }, 3000);
    }
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageId: number) => {
      const res = await apiRequest('PATCH', `/api/messages/${messageId}/read`, {});
      return res.json() as Promise<Message>;
    },
    onSuccess: () => {
      // Since we don't know which conversation this belongs to,
      // we could invalidate all conversations or be more targeted
      // based on additional context
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations'] 
      });
    },
  });
}

export function getMessageTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Check if within this year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // If older than a year
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
