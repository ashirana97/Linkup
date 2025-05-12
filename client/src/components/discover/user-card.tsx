import { useState } from "react";
import { CheckinWithDetails } from "@/lib/types";
import { getTimeSince } from "@/hooks/use-checkins";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Locate, User } from "lucide-react";

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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex">
        <div className="w-1/3 relative">
          <div className="h-full w-full">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage 
                src={checkin.user.profileImageUrl || ''} 
                alt={checkin.user.username}
                className="h-full w-full object-cover" 
              />
              <AvatarFallback className="h-full w-full rounded-none text-4xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          {isActive && (
            <div className="active-dot absolute right-0 bottom-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="w-2/3 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">
                {checkin.user.firstName || checkin.user.username}
              </h3>
              <p className="text-sm text-gray-500">Checked in {timeSince}</p>
            </div>
            <div className={`${getActivityStyle(checkin.activity.name)} text-xs font-medium rounded-full px-2 py-1`}>
              {checkin.activity.name}
            </div>
          </div>
          
          {checkin.note && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">{checkin.note}</p>
            </div>
          )}
          
          <div className="mt-3 flex flex-wrap gap-1">
            {checkin.interests.map(interest => (
              <span key={interest.id} className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                {interest.name}
              </span>
            ))}
          </div>
          
          <div className="mt-3 flex justify-end">
            <button 
              className="text-primary font-medium text-sm"
              onClick={() => onConnect(checkin.user.id)}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
