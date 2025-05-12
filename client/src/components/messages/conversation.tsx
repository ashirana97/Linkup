import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Info, Clock, MapPin } from "lucide-react";
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
      <div className="glass-card rounded-none flex items-center p-4 border-b">
        <Button onClick={onBack} variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage 
            src={partner.profileImageUrl || ''} 
            alt={partner.username} 
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
            {partnerInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{partner.firstName || partner.username}</h2>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last active recently</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Profile info (compact) */}
      {partner.interests && partner.interests.length > 0 && (
        <div className="bg-gray-50 p-2 flex items-center overflow-x-auto scrollbar-hidden">
          <div className="flex-shrink-0 text-xs text-gray-500 mr-2">Interests:</div>
          <div className="flex gap-1">
            {partner.interests.map(interest => (
              <span key={interest.id} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                {interest.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full">
            <div className="animate-pulse h-10 w-10 rounded-full bg-primary/20" />
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message: Message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                      {partnerInitials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                    isCurrentUser 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'glass-card rounded-bl-none'
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
          <div className="flex flex-col justify-center items-center h-full text-center">
            <div className="bg-primary bg-opacity-10 p-4 rounded-full mb-4">
              <Send className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Start a conversation</h3>
            <p className="text-gray-500 max-w-xs">
              Send a message to {partner.firstName || partner.username} to begin your conversation.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 glass-card rounded-none border-t flex">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 mr-2 bg-white"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || sendMessage.isPending}
          className="bg-primary text-white shadow-md"
        >
          <Send className="h-5 w-5 mr-1" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default Conversation;