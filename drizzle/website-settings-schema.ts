import { mysqlTable, varchar, text, timestamp, boolean, json, int } from "drizzle-orm/mysql-core";

/**
 * Website Settings Table
 * Stores editable website content and configuration
 */
export const websiteSettings = mysqlTable("website_settings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Hero Section
  heroTitleEn: text("hero_title_en"),
  heroTitleAr: text("hero_title_ar"),
  heroSubtitleEn: text("hero_subtitle_en"),
  heroSubtitleAr: text("hero_subtitle_ar"),
  heroDescriptionEn: text("hero_description_en"),
  heroDescriptionAr: text("hero_description_ar"),
  
  // Background Media
  backgroundVideos: json("background_videos").$type<string[]>(), // Array of video URLs
  backgroundImages: json("background_images").$type<string[]>(), // Array of image URLs
  slideshowSpeed: int("slideshow_speed").default(5000), // milliseconds
  
  // About Section
  aboutTitleEn: text("about_title_en"),
  aboutTitleAr: text("about_title_ar"),
  aboutDescriptionEn: text("about_description_en"),
  aboutDescriptionAr: text("about_description_ar"),
  
  // Features Section
  feature1TitleEn: text("feature1_title_en"),
  feature1TitleAr: text("feature1_title_ar"),
  feature1DescEn: text("feature1_desc_en"),
  feature1DescAr: text("feature1_desc_ar"),
  
  feature2TitleEn: text("feature2_title_en"),
  feature2TitleAr: text("feature2_title_ar"),
  feature2DescEn: text("feature2_desc_en"),
  feature2DescAr: text("feature2_desc_ar"),
  
  feature3TitleEn: text("feature3_title_en"),
  feature3TitleAr: text("feature3_title_ar"),
  feature3DescEn: text("feature3_desc_en"),
  feature3DescAr: text("feature3_desc_ar"),
  
  // Contact Information
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactWhatsapp: varchar("contact_whatsapp", { length: 50 }),
  contactAddress: text("contact_address"),
  
  // Social Media
  instagramUrl: varchar("instagram_url", { length: 512 }),
  facebookUrl: varchar("facebook_url", { length: 512 }),
  tiktokUrl: varchar("tiktok_url", { length: 512 }),
  
  // SEO
  metaTitleEn: varchar("meta_title_en", { length: 255 }),
  metaTitleAr: varchar("meta_title_ar", { length: 255 }),
  metaDescriptionEn: text("meta_description_en"),
  metaDescriptionAr: text("meta_description_ar"),
  metaKeywords: text("meta_keywords"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

/**
 * Media Library Table
 * Stores all uploaded media files
 */
export const mediaLibrary = mysqlTable("media_library", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 20 }).notNull(), // 'video', 'image'
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: varchar("file_size", { length: 50 }), // in bytes
  url: varchar("url", { length: 1024 }).notNull(), // S3 URL
  thumbnailUrl: varchar("thumbnail_url", { length: 1024 }), // For videos
  
  // Metadata
  width: int("width"),
  height: int("height"),
  duration: int("duration"), // For videos, in seconds
  
  // Organization
  category: varchar("category", { length: 100 }), // 'background', 'product', 'banner', etc.
  tags: json("tags").$type<string[]>(),
  
  // Usage tracking
  usedIn: json("used_in").$type<string[]>(), // Array of page/component IDs
  isActive: boolean("is_active").default(true),
  
  // Upload info
  uploadedBy: varchar("uploaded_by", { length: 64 }), // User ID
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

