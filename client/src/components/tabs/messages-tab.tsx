import { useState } from "react";
import { TabContent } from "@/components/ui/tab";
import MessageListItem from "@/components/messages/message-list-item";
import { useConversations } from "@/hooks/use-messages";
import { useLocation } from "wouter";

interface MessagesTabProps {
  active: boolean;
}

const MessagesTab = ({ active }: MessagesTabProps) => {
  const [, setLocation] = useLocation();
  
  // In a real app, get the current user ID from auth
  const currentUserId = 1;
  
  const { data: conversations, isLoading } = useConversations(currentUserId);
  
  const handleConversationClick = (userId: number) => {
    // Navigate to conversation with this user
    console.log(`Open conversation with user ${userId}`);
    
    // In a real app, this would navigate to a conversation page
    // For now, just stay on the messages tab
  };
  
  const navigateToDiscover = () => {
    setLocation("/");
  };
  
  return (
    <TabContent id="messages" active={active}>
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
    </TabContent>
  );
};

export default MessagesTab;
