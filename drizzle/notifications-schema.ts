import { mysqlTable, varchar, text, boolean, timestamp, mysqlEnum, int } from "drizzle-orm/mysql-core";

/**
 * Notifications table for in-app, email, SMS, and push notifications
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(), // Recipient user ID
  type: mysqlEnum("type", [
    "order_status",
    "admin_announcement",
    "system_alert",
    "customer_message",
    "promotion",
    "reminder"
  ]).notNull(),
  channel: mysqlEnum("channel", [
    "in_app",
    "email",
    "sms",
    "push"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  message: text("message").notNull(),
  messageAr: text("messageAr"),
  actionUrl: varchar("actionUrl", { length: 512 }),
  metadata: text("metadata"), // JSON: orderId, productId, etc.
  isRead: boolean("isRead").default(false),
  isArchived: boolean("isArchived").default(false),
  deliveryStatus: mysqlEnum("deliveryStatus", [
    "pending",
    "sent",
    "delivered",
    "failed",
    "bounced"
  ]).default("pending"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  scheduledFor: timestamp("scheduledFor"), // For scheduled notifications
  expiresAt: timestamp("expiresAt"), // Auto-archive after this date
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification preferences per user
 */
export const notificationPreferences = mysqlTable("notificationPreferences", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  orderStatusInApp: boolean("orderStatusInApp").default(true),
  orderStatusEmail: boolean("orderStatusEmail").default(true),
  orderStatusSms: boolean("orderStatusSms").default(false),
  orderStatusPush: boolean("orderStatusPush").default(true),
  announcementsInApp: boolean("announcementsInApp").default(true),
  announcementsEmail: boolean("announcementsEmail").default(true),
  announcementsSms: boolean("announcementsSms").default(false),
  announcementsPush: boolean("announcementsPush").default(false),
  promotionsInApp: boolean("promotionsInApp").default(true),
  promotionsEmail: boolean("promotionsEmail").default(true),
  promotionsSms: boolean("promotionsSms").default(false),
  promotionsPush: boolean("promotionsPush").default(false),
  remindersInApp: boolean("remindersInApp").default(true),
  remindersEmail: boolean("remindersEmail").default(false),
  remindersSms: boolean("remindersSms").default(false),
  remindersPush: boolean("remindersPush").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

/**
 * Notification templates for admins to create reusable messages
 */
export const notificationTemplates = mysqlTable("notificationTemplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "order_status",
    "admin_announcement",
    "system_alert",
    "customer_message",
    "promotion",
    "reminder"
  ]).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  messageEn: text("messageEn").notNull(),
  messageAr: text("messageAr"),
  variables: text("variables"), // JSON array of available variables like {{customerName}}, {{orderNumber}}
  isActive: boolean("isActive").default(true),
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = typeof notificationTemplates.$inferInsert;

/**
 * Broadcast notifications sent to multiple users
 */
export const notificationBroadcasts = mysqlTable("notificationBroadcasts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }),
  messageEn: text("messageEn").notNull(),
  messageAr: text("messageAr"),
  targetAudience: mysqlEnum("targetAudience", [
    "all_users",
    "customers_with_orders",
    "customers_without_orders",
    "specific_users"
  ]).notNull(),
  targetUserIds: text("targetUserIds"), // JSON array of user IDs for specific_users
  channels: text("channels"), // JSON array: ["in_app", "email", "sms", "push"]
  scheduledFor: timestamp("scheduledFor"),
  status: mysqlEnum("status", ["draft", "scheduled", "sending", "sent", "failed"]).default("draft"),
  totalRecipients: int("totalRecipients").default(0),
  sentCount: int("sentCount").default(0),
  deliveredCount: int("deliveredCount").default(0),
  failedCount: int("failedCount").default(0),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  sentAt: timestamp("sentAt"),
});

export type NotificationBroadcast = typeof notificationBroadcasts.$inferSelect;
export type InsertNotificationBroadcast = typeof notificationBroadcasts.$inferInsert;

