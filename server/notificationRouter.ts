import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  sendNotification,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  getUserNotifications,
  getUnreadCount,
  getUserPreferences,
  updateUserPreferences,
} from "./notificationService";

export const notificationRouter = router({
  /**
   * Get current user's notifications
   */
  getMyNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        includeArchived: z.boolean().optional(),
        channel: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      return await getUserNotifications(userId, input);
    }),

  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    return await getUnreadCount(userId);
  }),

  /**
   * Mark notification as read
   */
  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await markAsRead(input.notificationId, userId);
      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    await markAllAsRead(userId);
    return { success: true };
  }),

  /**
   * Archive notification
   */
  archive: protectedProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await archiveNotification(input.notificationId, userId);
      return { success: true };
    }),

  /**
   * Get user notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    return await getUserPreferences(userId);
  }),

  /**
   * Update user notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        orderStatusInApp: z.boolean().optional(),
        orderStatusEmail: z.boolean().optional(),
        orderStatusSms: z.boolean().optional(),
        orderStatusPush: z.boolean().optional(),
        announcementsInApp: z.boolean().optional(),
        announcementsEmail: z.boolean().optional(),
        announcementsSms: z.boolean().optional(),
        announcementsPush: z.boolean().optional(),
        promotionsInApp: z.boolean().optional(),
        promotionsEmail: z.boolean().optional(),
        promotionsSms: z.boolean().optional(),
        promotionsPush: z.boolean().optional(),
        remindersInApp: z.boolean().optional(),
        remindersEmail: z.boolean().optional(),
        remindersSms: z.boolean().optional(),
        remindersPush: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await updateUserPreferences(userId, input);
      return { success: true };
    }),
});

