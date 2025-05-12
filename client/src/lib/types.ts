import { 
  User, 
  Location, 
  Interest, 
  Activity, 
  Checkin, 
  Message 
} from "@shared/schema";

// Extended types for the frontend
export interface CheckinWithDetails extends Checkin {
  user: Omit<User, 'password'>;
  location: Location;
  activity: Activity;
  interests: Interest[];
}

export interface TimeSince {
  value: number;
  unit: string;
}

export interface ConversationSummary {
  user: Omit<User, 'password'>;
  latestMessage: Message;
}

export interface UserProfile extends Omit<User, 'password'> {
  interests: Interest[];
  activities: Activity[];
}
