/**
 * Admin Authentication and RBAC Setup
 * 
 * This module provides utilities for setting up admin users and managing role-based access control.
 * 
 * Default Admin Credentials:
 * - Username: Moath121
 * - Password: Dash001
 * 
 * IMPORTANT: These credentials should be changed on first login in production.
 */

import { getDb, getUser } from './db';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema';

/**
 * Setup default admin user
 * This should be called during initial application setup
 */
export async function setupDefaultAdmin(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Admin Setup] Database not available");
    return;
  }

  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("[Admin Setup] Admin user already exists");
      return;
    }

    // Create default admin user
    // In production, this should use proper password hashing
    const adminId = 'admin_moath121';
    const adminUser = {
      id: adminId,
      name: 'Moath',
      email: 'admin@lakbira.ae',
      loginMethod: 'admin',
      role: 'admin' as const,
      createdAt: new Date(),
      lastSignedIn: new Date(),
    };

    await db.insert(users).values(adminUser as any);
    console.log("[Admin Setup] Default admin user created successfully");
    console.log("[Admin Setup] Admin ID:", adminId);
    console.log("[Admin Setup] Please change the password on first login!");
  } catch (error) {
    console.error("[Admin Setup] Failed to setup admin user:", error);
  }
}

/**
 * Verify admin credentials
 * In production, use proper password hashing (bcrypt, argon2, etc.)
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // Default credentials - MUST BE CHANGED IN PRODUCTION
  const DEFAULT_USERNAME = 'Moath121';
  const DEFAULT_PASSWORD = 'Dash001';

  if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
    console.warn("[Admin Auth] Using default admin credentials - CHANGE IMMEDIATELY IN PRODUCTION");
    return true;
  }

  return false;
}

/**
 * Check if user has admin role
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUser(userId);
  return user?.role === 'admin';
}

/**
 * Promote user to admin
 */
export async function promoteToAdmin(userId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({ role: 'admin' })
    .where(eq(users.id, userId));

  console.log(`[Admin Setup] User ${userId} promoted to admin`);
}

/**
 * Demote admin to regular user
 */
export async function demoteFromAdmin(userId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({ role: 'user' })
    .where(eq(users.id, userId));

  console.log(`[Admin Setup] User ${userId} demoted to regular user`);
}

/**
 * Get all admin users
 */
export async function getAllAdmins(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(users)
    .where(eq(users.role, 'admin'));
}

/**
 * RBAC Permission Definitions
 */
export const ADMIN_PERMISSIONS = {
  // Order Management
  APPROVE_ORDER: 'order:approve',
  REJECT_ORDER: 'order:reject',
  UPDATE_ORDER_STATUS: 'order:update_status',
  DELETE_ORDER: 'order:delete',
  VIEW_ORDERS: 'order:view',

  // Client Management
  VIEW_CLIENTS: 'client:view',
  UPDATE_CLIENT: 'client:update',
  DELETE_CLIENT: 'client:delete',

  // Media Management
  UPLOAD_MEDIA: 'media:upload',
  DELETE_MEDIA: 'media:delete',
  UPDATE_MEDIA: 'media:update',

  // Collection Management
  CREATE_COLLECTION: 'collection:create',
  UPDATE_COLLECTION: 'collection:update',
  DELETE_COLLECTION: 'collection:delete',
  VIEW_COLLECTIONS: 'collection:view',

  // Product Management
  CREATE_PRODUCT: 'product:create',
  UPDATE_PRODUCT: 'product:update',
  DELETE_PRODUCT: 'product:delete',

  // Settings
  UPDATE_SETTINGS: 'settings:update',
  VIEW_AUDIT_LOGS: 'audit:view',
  MANAGE_ADMINS: 'admin:manage',
};

/**
 * Role-based permission mapping
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: Object.values(ADMIN_PERMISSIONS), // Admins have all permissions
  user: [
    ADMIN_PERMISSIONS.VIEW_ORDERS,
    ADMIN_PERMISSIONS.VIEW_CLIENTS,
    ADMIN_PERMISSIONS.VIEW_COLLECTIONS,
  ],
};

/**
 * Check if user has specific permission
 */
export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Validate admin action with audit logging
 */
export async function validateAdminAction(
  userId: string,
  action: string,
  permission: string
): Promise<boolean> {
  const user = await getUser(userId);

  if (!user) {
    console.warn(`[RBAC] User ${userId} not found`);
    return false;
  }

  if (!hasPermission(user.role, permission)) {
    console.warn(`[RBAC] User ${userId} (${user.role}) lacks permission for ${action}`);
    return false;
  }

  return true;
}

