import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Changed to varchar for Replit Auth user IDs
  username: text("username").notNull().unique(),
  password: text("password"), // Made optional for OAuth users
  email: varchar("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
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

// Connection requests table (for icebreakers)
export const connectionRequests = pgTable("connection_requests", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConnectionRequestSchema = createInsertSchema(connectionRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).pick({
  senderId: true,
  receiverId: true,
  message: true,
  status: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

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
export type InsertCheckin = z.infer<typeof insertCheckinSchema> & { interestIds?: number[] };

export type CheckinInterest = typeof checkinInterests.$inferSelect;
export type InsertCheckinInterest = z.infer<typeof insertCheckinInterestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ConnectionRequest = typeof connectionRequests.$inferSelect;
export type InsertConnectionRequest = z.infer<typeof insertConnectionRequestSchema>;
