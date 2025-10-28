import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { websiteSettings, mediaLibrary } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SETTINGS_ID = "main";

export const websiteRouter = router({
  /**
   * Get website settings
   */
  getSettings: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const settings = await db
      .select()
      .from(websiteSettings)
      .where(eq(websiteSettings.id, SETTINGS_ID))
      .limit(1);
    
    if (settings.length === 0) {
      // Return default settings
      return {
        id: SETTINGS_ID,
        heroTitleEn: "Ramadan Eid Collection 2024",
        heroTitleAr: "مجموعة رمضان",
        heroSubtitleEn: "Luxury Moroccan Kaftans",
        heroSubtitleAr: "قفاطين مغربية فاخرة",
        heroDescriptionEn: "Handcrafted luxury kaftans and abayas for the modern woman",
        heroDescriptionAr: "قفاطين وعباءات فاخرة مصنوعة يدوياً للمرأة العصرية",
        aboutTitleEn: "Why La Kbira?",
        aboutTitleAr: "لماذا لا كبيرة؟",
        aboutDescriptionEn: "Experience luxury fashion that honors tradition",
        aboutDescriptionAr: "اختبر الموضة الفاخرة التي تحترم التقاليد",
        contactEmail: "info@lakbira.com",
        contactPhone: "+971 XX XXX XXXX",
        contactWhatsapp: "+971 XX XXX XXXX",
        instagramUrl: "https://instagram.com/la_kbiraf",
        facebookUrl: "",
        tiktokUrl: "",
      };
    }
    
    return settings[0];
  }),

  /**
   * Update website settings (admin only)
   */
  updateSettings: publicProcedure
    .input(
      z.object({
        heroTitleEn: z.string().optional(),
        heroTitleAr: z.string().optional(),
        heroSubtitleEn: z.string().optional(),
        heroSubtitleAr: z.string().optional(),
        heroDescriptionEn: z.string().optional(),
        heroDescriptionAr: z.string().optional(),
        aboutTitleEn: z.string().optional(),
        aboutTitleAr: z.string().optional(),
        aboutDescriptionEn: z.string().optional(),
        aboutDescriptionAr: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        contactWhatsapp: z.string().optional(),
        instagramUrl: z.string().url().optional(),
        facebookUrl: z.string().url().optional(),
        tiktokUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check if settings exist
      const existing = await db
        .select()
        .from(websiteSettings)
        .where(eq(websiteSettings.id, SETTINGS_ID))
        .limit(1);
      
      if (existing.length === 0) {
        // Create new settings
        await db.insert(websiteSettings).values({
          id: SETTINGS_ID,
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Update existing settings
        await db
          .update(websiteSettings)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(websiteSettings.id, SETTINGS_ID));
      }
      
      return { success: true };
    }),

  /**
   * Upload media file (admin only)
   */
  uploadMedia: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.enum(["video", "image"]),
        mimeType: z.string(),
        fileSize: z.string(),
        url: z.string(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const mediaId = `media_${Date.now()}`;
      
      await db.insert(mediaLibrary).values({
        id: mediaId,
        ...input,
        isActive: true,
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return { id: mediaId, success: true };
    }),

  /**
   * Get all media files
   */
  getMediaLibrary: publicProcedure
    .input(
      z.object({
        fileType: z.enum(["video", "image", "all"]).optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      let query = db.select().from(mediaLibrary);
      
      if (input?.fileType && input.fileType !== "all") {
        query = query.where(eq(mediaLibrary.fileType, input.fileType)) as any;
      }
      
      if (input?.category) {
        query = query.where(eq(mediaLibrary.category, input.category)) as any;
      }
      
      const media = await query;
      return media;
    }),

  /**
   * Delete media file
   */
  deleteMedia: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      await db
        .update(mediaLibrary)
        .set({ isActive: false })
        .where(eq(mediaLibrary.id, input.id));
      
      return { success: true };
    }),
});

