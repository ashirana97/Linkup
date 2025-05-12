import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCheckinSchema, 
  insertCheckinInterestSchema,
  insertMessageSchema,
  insertUserInterestSchema,
  insertUserActivitySchema,
  type User
} from "@shared/schema";
import { z } from "zod";

// Add hours to date
const addHours = (date: Date, hours: number) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route('/api');
  
  // ===== User Routes =====
  
  // Get authenticated user
  app.get('/api/auth/me', async (req, res) => {
    try {
      // Use session userId if auth is implemented
      // For now, return first user for demo purposes
      const users = await storage.getAllUsers();
      const currentUser = users.length > 0 ? users[0] : null;
      
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      res.json(currentUser);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Register a new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.format() });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Login user
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get user profile
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Get user interests and activities
      const interests = await storage.getUserInterests(userId);
      const activities = await storage.getUserActivities(userId);
      
      res.json({
        ...userWithoutPassword,
        interests,
        activities
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update user profile
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user data
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add user interest
  app.post('/api/users/:id/interests', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userData = insertUserInterestSchema.parse({ ...req.body, userId });
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const interest = await storage.getInterest(userData.interestId);
      
      if (!interest) {
        return res.status(404).json({ message: "Interest not found" });
      }
      
      await storage.addUserInterest(userData);
      
      const interests = await storage.getUserInterests(userId);
      
      res.json(interests);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.format() });
      }
      console.error("Error adding user interest:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Remove user interest
  app.delete('/api/users/:userId/interests/:interestId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const interestId = parseInt(req.params.interestId);
      
      if (isNaN(userId) || isNaN(interestId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const interest = await storage.getInterest(interestId);
      
      if (!interest) {
        return res.status(404).json({ message: "Interest not found" });
      }
      
      await storage.removeUserInterest(userId, interestId);
      
      const interests = await storage.getUserInterests(userId);
      
      res.json(interests);
    } catch (error) {
      console.error("Error removing user interest:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add user activity
  app.post('/api/users/:id/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userData = insertUserActivitySchema.parse({ ...req.body, userId });
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activity = await storage.getActivity(userData.activityId);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      await storage.addUserActivity(userData);
      
      const activities = await storage.getUserActivities(userId);
      
      res.json(activities);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.format() });
      }
      console.error("Error adding user activity:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Remove user activity
  app.delete('/api/users/:userId/activities/:activityId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activityId = parseInt(req.params.activityId);
      
      if (isNaN(userId) || isNaN(activityId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const activity = await storage.getActivity(activityId);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      await storage.removeUserActivity(userId, activityId);
      
      const activities = await storage.getUserActivities(userId);
      
      res.json(activities);
    } catch (error) {
      console.error("Error removing user activity:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Location Routes =====
  
  // Get all locations
  app.get('/api/locations', async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get single location
  app.get('/api/locations/:id', async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      
      if (isNaN(locationId)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const location = await storage.getLocation(locationId);
      
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Interest Routes =====
  
  // Get all interests
  app.get('/api/interests', async (req, res) => {
    try {
      const interests = await storage.getAllInterests();
      res.json(interests);
    } catch (error) {
      console.error("Error fetching interests:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Activity Routes =====
  
  // Get all activities
  app.get('/api/activities', async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Check-in Routes =====
  
  // Get all active check-ins
  app.get('/api/checkins', async (req, res) => {
    try {
      const locationId = req.query.locationId ? parseInt(req.query.locationId as string) : undefined;
      
      let checkins;
      if (locationId && !isNaN(locationId)) {
        checkins = await storage.getActiveCheckinsByLocation(locationId);
      } else {
        checkins = await storage.getActiveCheckins();
      }
      
      // Fetch additional data for each check-in
      const checkinDetails = await Promise.all(checkins.map(async (checkin) => {
        const user = await storage.getUser(checkin.userId);
        const location = await storage.getLocation(checkin.locationId);
        const activity = await storage.getActivity(checkin.activityId);
        const interests = await storage.getCheckinInterests(checkin.id);
        
        // Remove password from user data
        const { password, ...userWithoutPassword } = user!;
        
        return {
          ...checkin,
          user: userWithoutPassword,
          location,
          activity,
          interests
        };
      }));
      
      res.json(checkinDetails);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get user check-ins
  app.get('/api/users/:id/checkins', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const checkins = await storage.getUserCheckins(userId);
      
      // Fetch additional data for each check-in
      const checkinDetails = await Promise.all(checkins.map(async (checkin) => {
        const location = await storage.getLocation(checkin.locationId);
        const activity = await storage.getActivity(checkin.activityId);
        const interests = await storage.getCheckinInterests(checkin.id);
        
        return {
          ...checkin,
          location,
          activity,
          interests
        };
      }));
      
      res.json(checkinDetails);
    } catch (error) {
      console.error("Error fetching user check-ins:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create a check-in
  app.post('/api/checkins', async (req, res) => {
    try {
      const { duration, interestIds, ...checkinData } = req.body;
      
      // Calculate expiration time
      const durationHours = parseInt(duration) || 1;
      const expiresAt = addHours(new Date(), durationHours);
      
      const checkinWithExpiry = {
        ...checkinData,
        expiresAt
      };
      
      const validatedCheckin = insertCheckinSchema.parse(checkinWithExpiry);
      
      // Check if resources exist
      const user = await storage.getUser(validatedCheckin.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const location = await storage.getLocation(validatedCheckin.locationId);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      const activity = await storage.getActivity(validatedCheckin.activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      // Create the check-in
      const newCheckin = await storage.createCheckin(validatedCheckin);
      
      // Add check-in interests if provided
      if (interestIds && Array.isArray(interestIds)) {
        for (const interestId of interestIds) {
          const interest = await storage.getInterest(interestId);
          if (interest) {
            await storage.addCheckinInterest({
              checkinId: newCheckin.id,
              interestId
            });
          }
        }
      }
      
      // Fetch the complete check-in details
      const interests = await storage.getCheckinInterests(newCheckin.id);
      
      // Remove password from user data
      const { password, ...userWithoutPassword } = user;
      
      const checkinDetails = {
        ...newCheckin,
        user: userWithoutPassword,
        location,
        activity,
        interests
      };
      
      res.status(201).json(checkinDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.format() });
      }
      console.error("Error creating check-in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Deactivate a check-in
  app.post('/api/checkins/:id/deactivate', async (req, res) => {
    try {
      const checkinId = parseInt(req.params.id);
      
      if (isNaN(checkinId)) {
        return res.status(400).json({ message: "Invalid check-in ID" });
      }
      
      const checkin = await storage.getCheckin(checkinId);
      
      if (!checkin) {
        return res.status(404).json({ message: "Check-in not found" });
      }
      
      const updatedCheckin = await storage.deactivateCheckin(checkinId);
      
      if (!updatedCheckin) {
        return res.status(404).json({ message: "Check-in not found" });
      }
      
      res.json(updatedCheckin);
    } catch (error) {
      console.error("Error deactivating check-in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // ===== Message Routes =====
  
  // Get user conversations (summary of all conversations)
  // Get recommended users based on shared interests
  app.get('/api/users/:id/recommendations', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // 1. Get the user's interests
      const userInterests = await storage.getUserInterests(userId);
      
      if (!userInterests || userInterests.length === 0) {
        return res.json([]);
      }
      
      // 2. Get all users
      const allUsers = await storage.getAllUsers();
      
      // 3. Calculate interest similarity for each user
      const recommendations = [];
      
      for (const otherUser of allUsers) {
        // Skip the current user
        if (otherUser.id === userId) continue;
        
        // Get the other user's interests
        const otherUserInterests = await storage.getUserInterests(otherUser.id);
        
        if (!otherUserInterests || otherUserInterests.length === 0) continue;
        
        // Calculate similarity score (Jaccard index)
        const userInterestIds = new Set(userInterests.map(i => i.id));
        const otherUserInterestIds = new Set(otherUserInterests.map(i => i.id));
        
        // Find shared interests
        const sharedInterests = userInterests.filter(interest => 
          otherUserInterestIds.has(interest.id)
        );
        
        // Calculate intersection size
        const intersectionSize = sharedInterests.length;
        
        // Calculate union size (A ∪ B)
        const unionSize = userInterestIds.size + otherUserInterestIds.size - intersectionSize;
        
        // Calculate Jaccard index (0 to 1) - J(A,B) = |A ∩ B| / |A ∪ B|
        const similarity = unionSize > 0 ? intersectionSize / unionSize : 0;
        
        // Store recommendation with similarity score and shared interests
        if (similarity > 0) {
          const { password, ...userWithoutPassword } = otherUser;
          recommendations.push({
            user: userWithoutPassword,
            similarityScore: similarity.toFixed(2),
            sharedInterests,
            totalSharedInterests: sharedInterests.length
          });
        }
      }
      
      // 4. Sort by similarity score (descending)
      recommendations.sort((a, b) => 
        parseFloat(b.similarityScore as string) - parseFloat(a.similarityScore as string)
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      res.status(500).json({ message: "Failed to get user recommendations" });
    }
  });
  
  app.get('/api/users/:id/conversations', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const conversations = await storage.getUserConversations(userId);
      
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get messages for a conversation (endpoint moved below)
  
  // Create a new message
  app.post('/api/messages', async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Check if users exist
      const sender = await storage.getUser(messageData.senderId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
      
      const receiver = await storage.getUser(messageData.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      // Create the message
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Mark message as read
  app.patch('/api/messages/:id/read', async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(messageId);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get conversation messages
  app.get('/api/conversations/:partnerId', async (req, res) => {
    try {
      const userId = 1; // Replace with actual user ID from auth
      const partnerId = parseInt(req.params.partnerId);
      
      if (isNaN(partnerId)) {
        return res.status(400).json({ message: "Invalid partner ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const partner = await storage.getUser(partnerId);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      // Get all messages between the two users
      const allUserMessages = await storage.getUserMessages(userId);
      const conversationMessages = allUserMessages.filter(message => 
        (message.senderId === userId && message.receiverId === partnerId) ||
        (message.senderId === partnerId && message.receiverId === userId)
      );
      
      // Sort by date
      conversationMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      res.json(conversationMessages);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Send a message
  app.post('/api/messages', async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Check if users exist
      const sender = await storage.getUser(messageData.senderId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
      
      const receiver = await storage.getUser(messageData.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      const newMessage = await storage.createMessage(messageData);
      
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.format() });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Mark message as read
  app.post('/api/messages/:id/read', async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      const message = await storage.getMessage(messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(messageId);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Helper function to add some methods to the storage interface
  storage.getAllUsers = async (): Promise<User[]> => {
    return Array.from(storage.users.values());
  };

  const httpServer = createServer(app);
  return httpServer;
}
