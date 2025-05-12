import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabContent } from "@/components/ui/tab";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface ProfileTabProps {
  active: boolean;
}

const ProfileTab = ({ active }: ProfileTabProps) => {
  // In a real app, get the current user ID from auth
  const currentUserId = 1;
  
  // Fetch user profile
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: [`/api/users/${currentUserId}`],
  });
  
  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const initials = profile ? getInitials(profile.firstName || profile.username) : '?';
  
  if (isLoading) {
    return (
      <TabContent id="profile" active={active}>
        <div className="animate-pulse space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-3"></div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-3"></div>
          </div>
          
          <div className="bg-white rounded-lg shadow h-48"></div>
          <div className="bg-white rounded-lg shadow h-32"></div>
        </div>
      </TabContent>
    );
  }
  
  return (
    <TabContent id="profile" active={active}>
      <div className="flex flex-col items-center mb-6 tab-header">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
          <Avatar className="w-full h-full">
            <AvatarImage 
              src={profile?.profileImageUrl || ''} 
              alt={profile?.username || 'Profile'}
              className="w-full h-full object-cover" 
            />
            <AvatarFallback className="w-full h-full text-4xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          {profile?.firstName || profile?.username || 'User'}
        </h1>
        <p className="text-sm text-gray-500">
          {profile?.bio || 'No bio yet'} • {profile?.location || 'No location set'}
        </p>
        <div className="mt-3 flex">
          <Button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium">
            Edit Profile
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100 mb-6">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">About Me</h2>
          <p className="text-gray-700">
            {profile?.bio || 'No bio yet. Edit your profile to add more information about yourself.'}
          </p>
        </div>
        
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">My Interests</h2>
          {profile?.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <span key={interest.id} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 text-sm">
                  {interest.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No interests added yet</p>
          )}
        </div>
        
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">Preferred Activities</h2>
          {profile?.activities && profile.activities.length > 0 ? (
            <div className="space-y-2">
              {profile.activities.map(activity => (
                <div key={activity.id} className="flex items-center">
                  <i className={`${activity.icon} text-primary mr-2`}></i>
                  <span>{activity.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No preferred activities added yet</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100 mb-6">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-3">Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Notification Preferences</p>
                <p className="text-xs text-gray-500">Manage how you receive notifications</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Privacy Settings</p>
                <p className="text-xs text-gray-500">Control what information is visible to others</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Account Information</p>
                <p className="text-xs text-gray-500">Update your email and personal info</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-16">
        <button className="text-destructive font-medium">Sign Out</button>
      </div>
    </TabContent>
  );
};

export default ProfileTab;
