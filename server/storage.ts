import {
  users, type User, type InsertUser, type UpsertUser,
  locations, type Location, type InsertLocation,
  interests, type Interest, type InsertInterest,
  userInterests, type UserInterest, type InsertUserInterest,
  activities, type Activity, type InsertActivity,
  userActivities, type UserActivity, type InsertUserActivity,
  checkins, type Checkin, type InsertCheckin,
  checkinInterests, type CheckinInterest, type InsertCheckinInterest,
  messages, type Message, type InsertMessage,
  connectionRequests, type ConnectionRequest, type InsertConnectionRequest
} from "@shared/schema";

// Modify the interface with any CRUD methods you need
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Location methods
  getLocation(id: number): Promise<Location | undefined>;
  getAllLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Interest methods
  getInterest(id: number): Promise<Interest | undefined>;
  getAllInterests(): Promise<Interest[]>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  
  // User Interests methods
  getUserInterests(userId: number): Promise<Interest[]>;
  addUserInterest(userInterest: InsertUserInterest): Promise<UserInterest>;
  removeUserInterest(userId: number, interestId: number): Promise<void>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // User Activities methods
  getUserActivities(userId: number): Promise<Activity[]>;
  addUserActivity(userActivity: InsertUserActivity): Promise<UserActivity>;
  removeUserActivity(userId: number, activityId: number): Promise<void>;
  
  // Check-in methods
  getCheckin(id: number): Promise<Checkin | undefined>;
  getUserCheckins(userId: number): Promise<Checkin[]>;
  getActiveCheckins(): Promise<Checkin[]>;
  getActiveCheckinsByLocation(locationId: number): Promise<Checkin[]>;
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  deactivateCheckin(id: number): Promise<Checkin | undefined>;
  
  // Check-in Interests methods
  getCheckinInterests(checkinId: number): Promise<Interest[]>;
  addCheckinInterest(checkinInterest: InsertCheckinInterest): Promise<CheckinInterest>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getUserMessages(userId: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{ user: User, latestMessage: Message }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Connection Request methods
  getConnectionRequest(id: number): Promise<ConnectionRequest | undefined>;
  getUserSentConnectionRequests(userId: number): Promise<ConnectionRequest[]>;
  getUserReceivedConnectionRequests(userId: number): Promise<ConnectionRequest[]>;
  createConnectionRequest(request: InsertConnectionRequest): Promise<ConnectionRequest>;
  updateConnectionRequestStatus(id: number, status: string): Promise<ConnectionRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<number, Location>;
  private interests: Map<number, Interest>;
  private userInterests: Map<number, UserInterest>;
  private activities: Map<number, Activity>;
  private userActivities: Map<number, UserActivity>;
  private checkins: Map<number, Checkin>;
  private checkinInterests: Map<number, CheckinInterest>;
  private messages: Map<number, Message>;
  private connectionRequests: Map<number, ConnectionRequest>;
  
  currentUserId: number;
  currentLocationId: number;
  currentInterestId: number;
  currentUserInterestId: number;
  currentActivityId: number;
  currentUserActivityId: number;
  currentCheckinId: number;
  currentCheckinInterestId: number;
  currentMessageId: number;
  currentConnectionRequestId: number;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.interests = new Map();
    this.userInterests = new Map();
    this.activities = new Map();
    this.userActivities = new Map();
    this.checkins = new Map();
    this.checkinInterests = new Map();
    this.messages = new Map();
    this.connectionRequests = new Map();
    
    this.currentUserId = 1;
    this.currentLocationId = 1;
    this.currentInterestId = 1;
    this.currentUserInterestId = 1;
    this.currentActivityId = 1;
    this.currentUserActivityId = 1;
    this.currentCheckinId = 1;
    this.currentCheckinInterestId = 1;
    this.currentMessageId = 1;
    this.currentConnectionRequestId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Add a default user for the current logged in user
    const defaultUser: InsertUser = {
      username: "demo_user",
      password: "password123",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null,
      bio: "I'm a demo user exploring the app",
      location: "San Francisco"
    };
    
    this.createUser(defaultUser);
    
    // Add more sample users for social discovery
    const sampleUsers: InsertUser[] = [
      {
        username: "alex_dev",
        password: "password123",
        firstName: "Alex",
        lastName: "Chen",
        profileImageUrl: null,
        bio: "Software engineer & coffee enthusiast",
        location: "San Francisco"
      },
      {
        username: "sara_design",
        password: "password123",
        firstName: "Sara",
        lastName: "Johnson",
        profileImageUrl: null,
        bio: "UX Designer looking for collaboration",
        location: "San Francisco"
      },
      {
        username: "mike_data",
        password: "password123",
        firstName: "Mike",
        lastName: "Wilson",
        profileImageUrl: null,
        bio: "Data scientist & math tutor",
        location: "San Francisco"
      }
    ];
    
    // Create sample users (IDs will be 2, 3, 4)
    sampleUsers.forEach(user => this.createUser(user));
    
    // Add sample locations
    const locations: InsertLocation[] = [
      { name: "Downtown Coffee Shop", address: "123 Main St", type: "coffee", icon: "ri-store-2-line" },
      { name: "Central Library", address: "500 Park Ave", type: "library", icon: "ri-book-open-line" },
      { name: "Tech Hub Coworking", address: "850 Innovation Dr", type: "coworking", icon: "ri-computer-line" }
    ];
    
    locations.forEach(location => this.createLocation(location));
    
    // Add sample activities
    const activities: InsertActivity[] = [
      { name: "Networking", icon: "ri-team-line" },
      { name: "Studying", icon: "ri-book-read-line" },
      { name: "Collaboration", icon: "ri-team-line" },
      { name: "Making Friends", icon: "ri-user-smile-line" }
    ];
    
    activities.forEach(activity => this.createActivity(activity));
    
    // Add sample interests
    const interests: InsertInterest[] = [
      { name: "UX Design" },
      { name: "Programming" },
      { name: "Web Development" },
      { name: "Marketing" },
      { name: "Data Science" },
      { name: "Startups" },
      { name: "Coffee" },
      { name: "Remote Work" },
      { name: "Tech" },
      { name: "Product Strategy" },
      { name: "Math" },
      { name: "Business" }
    ];
    
    interests.forEach(interest => this.createInterest(interest));
    
    // Add interests to users
    this.addUserInterest({ userId: 2, interestId: 3 }); // Alex: Web Development
    this.addUserInterest({ userId: 2, interestId: 2 }); // Alex: Programming
    this.addUserInterest({ userId: 2, interestId: 7 }); // Alex: Coffee
    
    this.addUserInterest({ userId: 3, interestId: 1 }); // Sara: UX Design
    this.addUserInterest({ userId: 3, interestId: 3 }); // Sara: Web Development
    this.addUserInterest({ userId: 3, interestId: 9 }); // Sara: Tech
    
    this.addUserInterest({ userId: 4, interestId: 5 }); // Mike: Data Science
    this.addUserInterest({ userId: 4, interestId: 11 }); // Mike: Math
    this.addUserInterest({ userId: 4, interestId: 12 }); // Mike: Business
    
    // Create active check-ins for the sample users at different locations
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Sara is at Tech Hub Coworking (collaboration)
    this.createCheckin({
      userId: 3,
      locationId: 3,
      activityId: 3,
      note: "Looking for design feedback on my latest project",
      expiresAt: oneHourLater,
      interestIds: [1]
    });
    
    // Mike is at Central Library (studying)
    this.createCheckin({
      userId: 4,
      locationId: 2,
      activityId: 2,
      note: "Studying data science, happy to help with math questions",
      expiresAt: oneHourLater,
      interestIds: [5, 11]
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Generate a string ID for new users
    const id = insertUser.id || `${this.currentUserId++}`;
    const user: User = { 
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...updateData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? await this.getUser(userData.id) : undefined;
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      return this.createUser(userData);
    }
  }
  
  // Location methods
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }
  
  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const newLocation: Location = { ...location, id };
    this.locations.set(id, newLocation);
    return newLocation;
  }
  
  // Interest methods
  async getInterest(id: number): Promise<Interest | undefined> {
    return this.interests.get(id);
  }
  
  async getAllInterests(): Promise<Interest[]> {
    return Array.from(this.interests.values());
  }
  
  async createInterest(interest: InsertInterest): Promise<Interest> {
    const id = this.currentInterestId++;
    const newInterest: Interest = { ...interest, id };
    this.interests.set(id, newInterest);
    return newInterest;
  }
  
  // User Interests methods
  async getUserInterests(userId: number): Promise<Interest[]> {
    const userInterestList = Array.from(this.userInterests.values())
      .filter(ui => ui.userId === userId);
    
    const interests: Interest[] = [];
    for (const ui of userInterestList) {
      const interest = await this.getInterest(ui.interestId);
      if (interest) interests.push(interest);
    }
    
    return interests;
  }
  
  async addUserInterest(userInterest: InsertUserInterest): Promise<UserInterest> {
    const id = this.currentUserInterestId++;
    const newUserInterest: UserInterest = { ...userInterest, id };
    this.userInterests.set(id, newUserInterest);
    return newUserInterest;
  }
  
  async removeUserInterest(userId: number, interestId: number): Promise<void> {
    const userInterestEntry = Array.from(this.userInterests.entries())
      .find(([_, ui]) => ui.userId === userId && ui.interestId === interestId);
    
    if (userInterestEntry) {
      const [id] = userInterestEntry;
      this.userInterests.delete(id);
    }
  }
  
  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  // User Activities methods
  async getUserActivities(userId: number): Promise<Activity[]> {
    const userActivityList = Array.from(this.userActivities.values())
      .filter(ua => ua.userId === userId);
    
    const activities: Activity[] = [];
    for (const ua of userActivityList) {
      const activity = await this.getActivity(ua.activityId);
      if (activity) activities.push(activity);
    }
    
    return activities;
  }
  
  async addUserActivity(userActivity: InsertUserActivity): Promise<UserActivity> {
    const id = this.currentUserActivityId++;
    const newUserActivity: UserActivity = { ...userActivity, id };
    this.userActivities.set(id, newUserActivity);
    return newUserActivity;
  }
  
  async removeUserActivity(userId: number, activityId: number): Promise<void> {
    const userActivityEntry = Array.from(this.userActivities.entries())
      .find(([_, ua]) => ua.userId === userId && ua.activityId === activityId);
    
    if (userActivityEntry) {
      const [id] = userActivityEntry;
      this.userActivities.delete(id);
    }
  }
  
  // Check-in methods
  async getCheckin(id: number): Promise<Checkin | undefined> {
    return this.checkins.get(id);
  }
  
  async getUserCheckins(userId: number): Promise<Checkin[]> {
    return Array.from(this.checkins.values())
      .filter(checkin => checkin.userId === userId);
  }
  
  async getActiveCheckins(): Promise<Checkin[]> {
    const now = new Date();
    return Array.from(this.checkins.values())
      .filter(checkin => checkin.isActive && new Date(checkin.expiresAt) > now);
  }
  
  async getActiveCheckinsByLocation(locationId: number): Promise<Checkin[]> {
    const now = new Date();
    return Array.from(this.checkins.values())
      .filter(checkin => 
        checkin.locationId === locationId && 
        checkin.isActive && 
        new Date(checkin.expiresAt) > now
      );
  }
  
  async createCheckin(checkin: InsertCheckin): Promise<Checkin> {
    const id = this.currentCheckinId++;
    
    // Extract and remove interestIds from checkin data
    const interestIds = checkin.interestIds || [];
    const { interestIds: _, ...checkinData } = checkin;
    
    const newCheckin: Checkin = { 
      ...checkinData, 
      id, 
      createdAt: new Date(), 
      isActive: true 
    };
    this.checkins.set(id, newCheckin);
    
    // Add checkin interests if provided
    for (const interestId of interestIds) {
      await this.addCheckinInterest({
        checkinId: id,
        interestId
      });
    }
    
    return newCheckin;
  }
  
  async deactivateCheckin(id: number): Promise<Checkin | undefined> {
    const checkin = await this.getCheckin(id);
    if (!checkin) return undefined;
    
    const updatedCheckin: Checkin = { ...checkin, isActive: false };
    this.checkins.set(id, updatedCheckin);
    return updatedCheckin;
  }
  
  // Check-in Interests methods
  async getCheckinInterests(checkinId: number): Promise<Interest[]> {
    const checkinInterestList = Array.from(this.checkinInterests.values())
      .filter(ci => ci.checkinId === checkinId);
    
    const interests: Interest[] = [];
    for (const ci of checkinInterestList) {
      const interest = await this.getInterest(ci.interestId);
      if (interest) interests.push(interest);
    }
    
    return interests;
  }
  
  async addCheckinInterest(checkinInterest: InsertCheckinInterest): Promise<CheckinInterest> {
    const id = this.currentCheckinInterestId++;
    const newCheckinInterest: CheckinInterest = { ...checkinInterest, id };
    this.checkinInterests.set(id, newCheckinInterest);
    return newCheckinInterest;
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUserConversations(userId: number): Promise<{ user: User, latestMessage: Message }[]> {
    const userMessages = await this.getUserMessages(userId);
    
    // Group messages by conversation partner
    const conversationMap = new Map<number, Message[]>();
    
    for (const message of userMessages) {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, []);
      }
      
      conversationMap.get(partnerId)!.push(message);
    }
    
    // Get the latest message for each conversation
    const conversations: { user: User, latestMessage: Message }[] = [];
    
    for (const [partnerId, messages] of conversationMap.entries()) {
      const partner = await this.getUser(partnerId);
      if (!partner) continue;
      
      // Sort messages by date and get the latest one
      messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latestMessage = messages[0];
      
      conversations.push({ user: partner, latestMessage });
    }
    
    // Sort conversations by the latest message date
    conversations.sort((a, b) => 
      new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime()
    );
    
    return conversations;
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { 
      ...message, 
      id, 
      createdAt: new Date(), 
      isRead: false 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage: Message = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Connection Request methods
  async getConnectionRequest(id: number): Promise<ConnectionRequest | undefined> {
    return this.connectionRequests.get(id);
  }

  async getUserSentConnectionRequests(userId: number): Promise<ConnectionRequest[]> {
    return Array.from(this.connectionRequests.values())
      .filter(request => request.senderId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUserReceivedConnectionRequests(userId: number): Promise<ConnectionRequest[]> {
    return Array.from(this.connectionRequests.values())
      .filter(request => request.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createConnectionRequest(request: InsertConnectionRequest): Promise<ConnectionRequest> {
    const id = this.currentConnectionRequestId++;
    const newRequest: ConnectionRequest = { 
      ...request, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.connectionRequests.set(id, newRequest);
    return newRequest;
  }

  async updateConnectionRequestStatus(id: number, status: string): Promise<ConnectionRequest | undefined> {
    const request = await this.getConnectionRequest(id);
    if (!request) return undefined;
    
    const updatedRequest: ConnectionRequest = { 
      ...request, 
      status, 
      updatedAt: new Date() 
    };
    this.connectionRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
