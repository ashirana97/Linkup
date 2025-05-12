import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  location: text("location"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  bio: true,
  location: true,
});

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // coffee shop, library, coworking space, etc.
  icon: text("icon"), // Icon identifier for the location type
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  address: true,
  type: true,
  icon: true,
});

// Interests table
export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertInterestSchema = createInsertSchema(interests).pick({
  name: true,
});

// User Interests junction table
export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  interestId: integer("interest_id").notNull(),
});

export const insertUserInterestSchema = createInsertSchema(userInterests).pick({
  userId: true,
  interestId: true,
});

// Activities (like networking, studying, etc.)
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"), // Icon identifier for the activity
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  name: true,
  icon: true,
});

// User preferred activities
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityId: integer("activity_id").notNull(),
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  activityId: true,
});

// Check-ins table
export const checkins = pgTable("checkins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  locationId: integer("location_id").notNull(),
  activityId: integer("activity_id").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertCheckinSchema = createInsertSchema(checkins).omit({
  id: true,
  createdAt: true,
}).pick({
  userId: true,
  locationId: true,
  activityId: true,
  note: true,
  expiresAt: true,
});

// Check-in interests
export const checkinInterests = pgTable("checkin_interests", {
  id: serial("id").primaryKey(),
  checkinId: integer("checkin_id").notNull(),
  interestId: integer("interest_id").notNull(),
});

export const insertCheckinInterestSchema = createInsertSchema(checkinInterests).pick({
  checkinId: true,
  interestId: true,
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
}).pick({
  senderId: true,
  receiverId: true,
  content: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = z.infer<typeof insertUserInterestSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

export type Checkin = typeof checkins.$inferSelect;
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;

export type CheckinInterest = typeof checkinInterests.$inferSelect;
export type InsertCheckinInterest = z.infer<typeof insertCheckinInterestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
