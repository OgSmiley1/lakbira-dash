import { nanoid } from "nanoid";
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import { 
  notifications, 
  notificationPreferences,
  notificationTemplates,
  notificationBroadcasts,
  type InsertNotification,
  type InsertNotificationBroadcast
} from "../drizzle/schema";

/**
 * Notification Service
 * Handles all notification operations: create, send, mark as read, etc.
 */

export interface NotificationOptions {
  userId: string;
  type: "order_status" | "admin_announcement" | "system_alert" | "customer_message" | "promotion" | "reminder";
  titleEn: string;
  titleAr?: string;
  messageEn: string;
  messageAr?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  channels?: ("in_app" | "email" | "sms" | "push")[];
  priority?: "low" | "medium" | "high" | "urgent";
  scheduledFor?: Date;
  expiresAt?: Date;
}

/**
 * Send a notification to a user across specified channels
 */
export async function sendNotification(options: NotificationOptions): Promise<string[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const notificationIds: string[] = [];
  
  // Get user preferences
  const prefs = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, options.userId))
    .limit(1);
  
  const userPrefs = prefs[0];
  
  // Determine which channels to use
  const channels = options.channels || ["in_app"];
  const enabledChannels = channels.filter(channel => {
    if (!userPrefs) return true; // If no preferences, allow all
    
    // Check user preferences for this notification type and channel
    const prefKey = `${options.type.replace("_", "")}${channel.charAt(0).toUpperCase() + channel.slice(1).replace("_", "")}`;
    return (userPrefs as any)[prefKey] !== false;
  });
  
  // Create notification for each enabled channel
  for (const channel of enabledChannels) {
    const notificationId = nanoid();
    
    await db.insert(notifications).values({
      id: notificationId,
      userId: options.userId,
      type: options.type,
      channel,
      title: options.titleEn,
      titleAr: options.titleAr,
      message: options.messageEn,
      messageAr: options.messageAr,
      actionUrl: options.actionUrl,
      metadata: options.metadata ? JSON.stringify(options.metadata) : null,
      priority: options.priority || "medium",
      scheduledFor: options.scheduledFor,
      expiresAt: options.expiresAt,
      deliveryStatus: options.scheduledFor ? "pending" : "sent",
      deliveredAt: options.scheduledFor ? null : new Date(),
    });
    
    notificationIds.push(notificationId);
    
    // TODO: Implement actual delivery for email, SMS, push
    if (channel === "email") {
      await sendEmailNotification(options);
    } else if (channel === "sms") {
      await sendSMSNotification(options);
    } else if (channel === "push") {
      await sendPushNotification(options);
    }
  }
  
  return notificationIds;
}

/**
 * Send broadcast notification to multiple users
 */
export async function sendBroadcast(broadcast: InsertNotificationBroadcast): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const broadcastId = nanoid();
  
  // Create broadcast record
  await db.insert(notificationBroadcasts).values({
    ...broadcast,
    id: broadcastId,
    status: broadcast.scheduledFor ? "scheduled" : "sending",
  });
  
  // Get target users
  let targetUserIds: string[] = [];
  
  if (broadcast.targetAudience === "all_users") {
    // TODO: Get all user IDs
    targetUserIds = []; // Implement user fetching
  } else if (broadcast.targetAudience === "specific_users" && broadcast.targetUserIds) {
    targetUserIds = JSON.parse(broadcast.targetUserIds);
  }
  
  // Send to each user
  const channels = broadcast.channels ? JSON.parse(broadcast.channels) : ["in_app"];
  let sentCount = 0;
  let deliveredCount = 0;
  let failedCount = 0;
  
  for (const userId of targetUserIds) {
    try {
      await sendNotification({
        userId,
        type: "admin_announcement",
        titleEn: broadcast.titleEn,
        titleAr: broadcast.titleAr || undefined,
        messageEn: broadcast.messageEn,
        messageAr: broadcast.messageAr || undefined,
        channels,
        scheduledFor: broadcast.scheduledFor || undefined,
      });
      sentCount++;
      deliveredCount++;
    } catch (error) {
      failedCount++;
    }
  }
  
  // Update broadcast stats
  await db
    .update(notificationBroadcasts)
    .set({
      status: "sent",
      totalRecipients: targetUserIds.length,
      sentCount,
      deliveredCount,
      failedCount,
      sentAt: new Date(),
    })
    .where(eq(notificationBroadcasts.id, broadcastId));
  
  return broadcastId;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    );
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
}

/**
 * Archive notification
 */
export async function archiveNotification(notificationId: string, userId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(notifications)
    .set({
      isArchived: true,
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    );
}

/**
 * Get user notifications with pagination
 */
export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    includeArchived?: boolean;
    channel?: string;
  } = {}
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const { limit = 20, offset = 0, includeArchived = false, channel } = options;
  
  const conditions = [eq(notifications.userId, userId)];
  
  if (!includeArchived) {
    conditions.push(eq(notifications.isArchived, false));
  }
  
  if (channel) {
    conditions.push(eq(notifications.channel, channel as any));
  }
  
  const results = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
  
  return results;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
        eq(notifications.isArchived, false)
      )
    );
  
  return result[0]?.count || 0;
}

/**
 * Get or create user notification preferences
 */
export async function getUserPreferences(userId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const existing = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Create default preferences
  const prefId = nanoid();
  await db.insert(notificationPreferences).values({
    id: prefId,
    userId,
  });
  
  const newPrefs = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.id, prefId))
    .limit(1);
  
  return newPrefs[0];
}

/**
 * Update user notification preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<typeof notificationPreferences.$inferInsert>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(notificationPreferences)
    .set(preferences)
    .where(eq(notificationPreferences.userId, userId));
}

// Placeholder functions for actual delivery (to be implemented with real services)
async function sendEmailNotification(options: NotificationOptions): Promise<void> {
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
  console.log(`📧 Email notification sent to user ${options.userId}`);
}

async function sendSMSNotification(options: NotificationOptions): Promise<void> {
  // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
  console.log(`📱 SMS notification sent to user ${options.userId}`);
}

async function sendPushNotification(options: NotificationOptions): Promise<void> {
  // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
  console.log(`🔔 Push notification sent to user ${options.userId}`);
}

/**
 * Send order status notification
 */
export async function sendOrderStatusNotification(
  userId: string,
  orderId: string,
  status: string,
  orderNumber: string
): Promise<void> {
  const statusMessages: Record<string, { en: string; ar: string }> = {
    pending: {
      en: "Your order is pending approval",
      ar: "طلبك قيد الموافقة"
    },
    approved: {
      en: "Your order has been approved!",
      ar: "تمت الموافقة على طلبك!"
    },
    in_production: {
      en: "Your order is being crafted",
      ar: "جاري تفصيل طلبك"
    },
    shipped: {
      en: "Your order has been shipped",
      ar: "تم شحن طلبك"
    },
    delivered: {
      en: "Your order has been delivered",
      ar: "تم توصيل طلبك"
    },
    rejected: {
      en: "Your order has been rejected",
      ar: "تم رفض طلبك"
    }
  };
  
  const message = statusMessages[status] || statusMessages.pending;
  
  await sendNotification({
    userId,
    type: "order_status",
    titleEn: `Order ${orderNumber} - ${status}`,
    titleAr: `الطلب ${orderNumber} - ${message.ar}`,
    messageEn: message.en,
    messageAr: message.ar,
    actionUrl: `/orders/${orderId}`,
    metadata: { orderId, status, orderNumber },
    channels: ["in_app", "email"],
    priority: status === "delivered" ? "high" : "medium",
  });
}

