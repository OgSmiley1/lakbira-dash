import { z } from "zod";

/**
 * Input validation schemas for admin operations
 */

// Order validation
export const orderApprovalSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  adminNotes: z.string().optional(),
});

export const orderRejectionSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.string().refine(
    (val) => ["pending", "approved", "deposit_paid", "in_production", "ready", "shipped", "delivered", "rejected", "cancelled"].includes(val),
    "Invalid order status"
  ),
  adminNotes: z.string().optional(),
});

// Collection validation
export const collectionCreateSchema = z.object({
  nameEn: z.string().min(3, "English name must be at least 3 characters"),
  nameAr: z.string().min(3, "Arabic name must be at least 3 characters"),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  storyEn: z.string().optional(),
  storyAr: z.string().optional(),
  coverImage: z.string().url("Invalid image URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
});

export const collectionUpdateSchema = collectionCreateSchema.extend({
  id: z.string().min(1, "Collection ID is required"),
  isActive: z.boolean().optional(),
});

// Product validation
export const productCreateSchema = z.object({
  nameEn: z.string().min(3, "English name must be at least 3 characters"),
  nameAr: z.string().min(3, "Arabic name must be at least 3 characters"),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  basePrice: z.number().min(0, "Price must be positive"),
  fabricEn: z.string().optional(),
  fabricAr: z.string().optional(),
  collectionId: z.string().optional(),
});

export const productUpdateSchema = productCreateSchema.extend({
  id: z.string().min(1, "Product ID is required"),
  isFeatured: z.boolean().optional(),
});

// Media validation
export const mediaUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().refine(
    (val) => ["image", "video"].includes(val),
    "File type must be image or video"
  ),
  fileSize: z.number().max(52428800, "File size must be less than 50MB"),
  mimeType: z.string(),
});

// Settings validation
export const settingsUpdateSchema = z.object({
  slideshowSpeed: z.number().min(1).max(30).optional(),
  enableNotifications: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
});

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file extension
 */
export function isValidFileExtension(fileName: string, allowedExtensions: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Validate MIME type
 */
export function isValidMimeType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return mimeType.startsWith(prefix);
    }
    return mimeType === type;
  });
}

/**
 * Validate order data
 */
export function validateOrderData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push("Customer name must be at least 2 characters");
  }

  if (data.customerEmail && !isValidEmail(data.customerEmail)) {
    errors.push("Invalid email format");
  }

  if (!data.customerPhone || !isValidPhone(data.customerPhone)) {
    errors.push("Invalid phone number format");
  }

  if (!data.shippingCity || data.shippingCity.trim().length < 2) {
    errors.push("Shipping city is required");
  }

  if (data.totalPrice < 0) {
    errors.push("Total price cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isLimited(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (record.count >= this.maxAttempts) {
      return true;
    }

    record.count++;
    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

