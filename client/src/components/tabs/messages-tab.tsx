import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabContent } from "@/components/ui/tab";
import MessageListItem from "@/components/messages/message-list-item";
import Conversation from "@/components/messages/conversation";
import { useConversations } from "@/hooks/use-messages";
import { useLocation } from "wouter";
import { UserProfile } from "@/lib/types";

interface MessagesTabProps {
  active: boolean;
}

const MessagesTab = ({ active }: MessagesTabProps) => {
  const [, setLocation] = useLocation();
  const [activeConversation, setActiveConversation] = useState<UserProfile | null>(null);
  
  // In a real app, get the current user ID from auth
  const currentUserId = 1;
  
  const { data: conversations, isLoading } = useConversations(currentUserId);
  
  // Get the active user's profile when a conversation is started
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/users', activeConversation?.id],
    enabled: !!activeConversation,
  });
  
  const handleConversationClick = (userId: number) => {
    // Fetch the user profile and open conversation
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(userData => {
        setActiveConversation(userData);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
      });
  };
  
  const navigateToDiscover = () => {
    setLocation("/");
  };
  
  // Return to conversation list
  const handleBackToList = () => {
    setActiveConversation(null);
  };
  
  return (
    <TabContent id="messages" active={active}>
      {activeConversation ? (
        // Show the conversation view
        <Conversation 
          partner={activeConversation}
          currentUserId={currentUserId}
          onBack={handleBackToList}
        />
      ) : (
        // Show the conversation list
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
              <p className="text-sm text-gray-500">Your conversations</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              // Loading state
              <>
                <div className="bg-white rounded-lg shadow animate-pulse h-24"></div>
                <div className="bg-white rounded-lg shadow animate-pulse h-24"></div>
                <div className="bg-white rounded-lg shadow animate-pulse h-24"></div>
              </>
            ) : conversations && conversations.length > 0 ? (
              // Render conversations
              conversations.map(conversation => (
                <MessageListItem
                  key={conversation.user.id}
                  conversation={conversation}
                  onClick={handleConversationClick}
                />
              ))
            ) : (
              // Empty state
              <div className="flex justify-center py-8 text-center text-gray-500">
                <div>
                  <p className="mb-2">Connect with more people to start conversations!</p>
                  <button 
                    className="text-primary font-medium"
                    onClick={navigateToDiscover}
                  >
                    Discover People
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </TabContent>
  );
};

export default MessagesTab;
