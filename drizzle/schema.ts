import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Collections (e.g., "Ramadan Eid Collection 2024")
 */
export const collections = mysqlTable("collections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  storyEn: text("storyEn"),
  storyAr: text("storyAr"),
  coverImage: varchar("coverImage", { length: 512 }),
  videoUrl: varchar("videoUrl", { length: 512 }),
  isActive: boolean("isActive").default(true),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

/**
 * Products (Kaftans, Abayas, etc.)
 */
export const products = mysqlTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  collectionId: varchar("collectionId", { length: 64 }),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  storyEn: text("storyEn"),
  storyAr: text("storyAr"),
  basePrice: int("basePrice").notNull(),
  fabricEn: varchar("fabricEn", { length: 255 }),
  fabricAr: varchar("fabricAr", { length: 255 }),
  images: text("images"),
  availableColors: text("availableColors"),
  availableSizes: text("availableSizes"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders (Waiting List / Registry)
 */
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
  customerWhatsapp: varchar("customerWhatsapp", { length: 50 }),
  shippingCity: varchar("shippingCity", { length: 255 }).notNull(),
  shippingAddress: text("shippingAddress"),
  shippingCountry: varchar("shippingCountry", { length: 100 }).default("UAE"),
  productId: varchar("productId", { length: 64 }).notNull(),
  selectedColor: varchar("selectedColor", { length: 100 }),
  selectedSize: varchar("selectedSize", { length: 50 }),
  customMeasurements: text("customMeasurements"),
  customerNotes: text("customerNotes"),
  basePrice: int("basePrice").notNull(),
  customizationFee: int("customizationFee").default(0),
  totalPrice: int("totalPrice").notNull(),
  depositAmount: int("depositAmount").default(0),
  status: mysqlEnum("status", [
    "pending",
    "approved",
    "deposit_paid",
    "in_production",
    "ready",
    "shipped",
    "delivered",
    "rejected",
    "cancelled"
  ]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  rejectionReason: text("rejectionReason"),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal"),
  isVip: boolean("isVip").default(false),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  approvedAt: timestamp("approvedAt"),
  rejectedAt: timestamp("rejectedAt"),
  completedAt: timestamp("completedAt"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order status history for tracking
 */
export const orderHistory = mysqlTable("orderHistory", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderId: varchar("orderId", { length: 64 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  notes: text("notes"),
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type OrderHistory = typeof orderHistory.$inferSelect;
export type InsertOrderHistory = typeof orderHistory.$inferInsert;

