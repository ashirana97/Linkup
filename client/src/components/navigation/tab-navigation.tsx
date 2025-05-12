import { useLocation } from "wouter";
import { 
  Compass,
  MapPin,
  MessageSquare,
  User
} from "lucide-react";

interface TabNavigationProps {
  active: string;
  onChange: (tab: string) => void;
}

const TabNavigation = ({ active, onChange }: TabNavigationProps) => {
  const [, setLocation] = useLocation();

  const handleTabChange = (tab: string) => {
    onChange(tab);
    
    // Update the URL to reflect the current tab
    setLocation(`/${tab === 'discover' ? '' : tab}`);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10">
      <div className="flex justify-around py-2 px-4">
        <button 
          onClick={() => handleTabChange('discover')}
          className={`flex flex-col items-center py-2 px-4 ${active === 'discover' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-xs mt-1">Discover</span>
        </button>
        
        <button 
          onClick={() => handleTabChange('checkin')}
          className={`flex flex-col items-center py-2 px-4 ${active === 'checkin' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-xs mt-1">Check In</span>
        </button>
        
        <button 
          onClick={() => handleTabChange('messages')}
          className={`flex flex-col items-center py-2 px-4 ${active === 'messages' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs mt-1">Messages</span>
        </button>
        
        <button 
          onClick={() => handleTabChange('profile')}
          className={`flex flex-col items-center py-2 px-4 ${active === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
