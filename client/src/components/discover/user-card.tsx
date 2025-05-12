import { CheckinWithDetails } from "@/lib/types";
import { getTimeSince } from "@/hooks/use-checkins";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, MapPin } from "lucide-react";

interface UserCardProps {
  checkin: CheckinWithDetails;
  onConnect: (userId: number) => void;
}

const UserCard = ({ checkin, onConnect }: UserCardProps) => {
  // Get activity style based on activity name
  const getActivityStyle = (activityName: string) => {
    switch (activityName.toLowerCase()) {
      case 'networking':
        return 'bg-success bg-opacity-10 text-success';
      case 'studying':
        return 'bg-blue-100 text-secondary';
      case 'collaboration':
        return 'bg-purple-100 text-accent';
      case 'making friends':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Check if user is active (check-in is recent)
  const isActive = new Date(checkin.expiresAt) > new Date();
  
  // Calculate time since check-in
  const timeSince = getTimeSince(checkin.createdAt);
  
  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const initials = getInitials(checkin.user.firstName || checkin.user.username);
  
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 relative">
          <div className="aspect-square sm:h-full w-full">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage 
                src={checkin.user.profileImageUrl || ''} 
                alt={checkin.user.username}
                className="h-full w-full object-cover" 
              />
              <AvatarFallback className="h-full w-full rounded-none text-4xl bg-gradient-to-br from-primary to-secondary text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          {isActive && (
            <div className="pulse absolute right-2 bottom-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="w-full sm:w-2/3 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {checkin.user.firstName || checkin.user.username}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                <span>Checked in {timeSince}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{checkin.location.name}</span>
              </div>
            </div>
            <div className={`${getActivityStyle(checkin.activity.name)} text-xs font-medium rounded-full px-3 py-1`}>
              {checkin.activity.name}
            </div>
          </div>
          
          {checkin.note && (
            <div className="mt-3 p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 italic">"{checkin.note}"</p>
            </div>
          )}
          
          <div className="mt-3 flex flex-wrap gap-1">
            {checkin.interests.map(interest => (
              <span key={interest.id} className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                {interest.name}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              size="sm"
              className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md transition-all" 
              onClick={() => onConnect(checkin.user.id)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
