import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useConversationMessages, useSendMessage } from "@/hooks/use-messages";
import { Message } from "@shared/schema";
import { UserProfile } from "@/lib/types";
import { getMessageTime } from "@/hooks/use-messages";

interface ConversationProps {
  partner: UserProfile;
  currentUserId: number;
  onBack: () => void;
}

const Conversation = ({ partner, currentUserId, onBack }: ConversationProps) => {
  const { data: messages, isLoading } = useConversationMessages(partner.id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendMessage();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const partnerInitials = getInitials(partner.firstName || partner.username);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessage.mutate({
      senderId: currentUserId,
      receiverId: partner.id,
      content: newMessage.trim()
    }, {
      onSuccess: () => {
        setNewMessage("");
      }
    });
  };
  
  const formatMessageTime = (dateString: string | Date | null) => {
    if (!dateString) return '';
    return getMessageTime(dateString);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage 
            src={partner.profileImageUrl || ''} 
            alt={partner.username} 
          />
          <AvatarFallback>
            {partnerInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{partner.firstName || partner.username}</h2>
          <p className="text-xs text-muted-foreground">{partner.bio || 'No bio'}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message: Message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || sendMessage.isPending}
          className="bg-primary text-white"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default Conversation;