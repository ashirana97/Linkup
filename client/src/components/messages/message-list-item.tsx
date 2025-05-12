import { ConversationSummary } from "@/lib/types";
import { getMessageTime } from "@/hooks/use-messages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MessageListItemProps {
  conversation: ConversationSummary;
  onClick: (userId: number) => void;
}

const MessageListItem = ({ conversation, onClick }: MessageListItemProps) => {
  const { user, latestMessage } = conversation;
  
  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const initials = getInitials(user.firstName || user.username);
  
  // Format message time
  const messageTime = getMessageTime(latestMessage.createdAt);
  
  // Check if user is active (has active check-in)
  const isActive = false; // In a real app, this would come from the server
  
  return (
    <div 
      className="glass-card flex items-center p-4 cursor-pointer hover:bg-white transition-all duration-200"
      onClick={() => onClick(user.id)}
    >
      <div className="w-14 h-14 relative mr-4">
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={user.profileImageUrl || ''} 
            alt={user.username}
            className="w-full h-full object-cover" 
          />
          <AvatarFallback className="w-full h-full text-lg bg-gradient-to-br from-primary to-secondary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isActive && (
          <div className="pulse absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">{user.firstName || user.username}</h3>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-500">{messageTime}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate max-w-[200px]">{latestMessage.content}</p>
          {!latestMessage.isRead && latestMessage.senderId !== 1 && (
            <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              <span className="text-[10px]">1</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageListItem;
