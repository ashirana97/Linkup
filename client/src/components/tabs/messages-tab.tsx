import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabContent } from "@/components/ui/tab";
import MessageListItem from "@/components/messages/message-list-item";
import Conversation from "@/components/messages/conversation";
import { useConversations } from "@/hooks/use-messages";
import { useLocation } from "wouter";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight, MessagesSquare } from "lucide-react";

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
    console.log("Opening conversation with user:", userId);
    
    // Fetch the user profile and open conversation
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        return res.json();
      })
      .then(userData => {
        console.log("User data received:", userData);
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
          <div className="flex justify-between items-center mb-6 tab-header">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Messages</h1>
              <p className="text-sm text-gray-500">Your conversations</p>
            </div>
          </div>
          
          <div className="space-y-3 tab-content">
            {isLoading ? (
              // Loading state
              <>
                <div className="glass-card animate-pulse h-24"></div>
                <div className="glass-card animate-pulse h-24"></div>
                <div className="glass-card animate-pulse h-24"></div>
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
              <div className="glass-card flex flex-col items-center py-12 text-center">
                <div className="mb-4 bg-primary bg-opacity-10 p-4 rounded-full">
                  <MessagesSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-gray-500 mb-6 max-w-xs">
                  Connect with people nearby to start conversations!
                </p>
                <Button 
                  onClick={navigateToDiscover}
                  className="flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Discover People
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </TabContent>
  );
};

export default MessagesTab;
