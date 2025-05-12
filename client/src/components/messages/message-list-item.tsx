import { User } from "@shared/schema";
import { ConversationSummary } from "@/lib/types";
import { getMessageTime } from "@/hooks/use-messages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      className="bg-white rounded-lg shadow flex items-center p-3 cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(user.id)}
    >
      <div className="w-14 h-14 relative mr-3">
        <Avatar className="w-full h-full">
          <AvatarImage 
            src={user.profileImageUrl || ''} 
            alt={user.username}
            className="w-full h-full object-cover" 
          />
          <AvatarFallback className="w-full h-full text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isActive && (
          <div className="active-dot absolute right-0 bottom-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold">{user.firstName || user.username}</h3>
          <span className="text-xs text-gray-500">{messageTime}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{latestMessage.content}</p>
      </div>
    </div>
  );
};

export default MessageListItem;
