import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, Product, InsertProduct, collections, Collection, InsertCollection, orders, Order, InsertOrder } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCTS ============

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(products).where(eq(products.isActive, true));
  
  // Parse JSON fields
  return result.map(p => ({
    ...p,
    images: p.images ? JSON.parse(p.images) : [],
    availableColors: p.availableColors ? JSON.parse(p.availableColors) : [],
    availableSizes: p.availableSizes ? JSON.parse(p.availableSizes) : [],
  }));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  
  if (result.length === 0) return undefined;
  
  const p = result[0];
  return {
    ...p,
    images: p.images ? JSON.parse(p.images) : [],
    availableColors: p.availableColors ? JSON.parse(p.availableColors) : [],
    availableSizes: p.availableSizes ? JSON.parse(p.availableSizes) : [],
  };
}

export async function createProduct(product: InsertProduct): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Stringify JSON fields
  const data = {
    ...product,
    images: product.images ? JSON.stringify(product.images) : null,
    availableColors: product.availableColors ? JSON.stringify(product.availableColors) : null,
    availableSizes: product.availableSizes ? JSON.stringify(product.availableSizes) : null,
  };

  await db.insert(products).values(data as any);
}

// ============ COLLECTIONS ============

export async function getAllCollections(): Promise<Collection[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(collections).where(eq(collections.isActive, true));
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(collections).where(eq(collections.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ ORDERS ============

export async function createOrder(orderData: Omit<InsertOrder, 'id' | 'orderNumber'>): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const orderId = nanoid();
  const orderNumber = `LK${Date.now().toString().slice(-8)}`;

  const data: InsertOrder = {
    ...orderData,
    id: orderId,
    orderNumber,
    customMeasurements: orderData.customMeasurements ? JSON.stringify(orderData.customMeasurements) : null,
    tags: orderData.tags ? JSON.stringify(orderData.tags) : null,
  };

  await db.insert(orders).values(data as any);
  return orderId;
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(orders);
  
  return result.map(o => ({
    ...o,
    customMeasurements: o.customMeasurements ? JSON.parse(o.customMeasurements) : null,
    tags: o.tags ? JSON.parse(o.tags) : [],
  }));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  
  if (result.length === 0) return undefined;
  
  const o = result[0];
  return {
    ...o,
    customMeasurements: o.customMeasurements ? JSON.parse(o.customMeasurements) : null,
    tags: o.tags ? JSON.parse(o.tags) : [],
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  adminNotes?: string,
  rejectionReason?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  
  if (status === 'approved') {
    updateData.approvedAt = new Date();
  } else if (status === 'rejected') {
    updateData.rejectedAt = new Date();
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
  } else if (status === 'delivered') {
    updateData.completedAt = new Date();
  }
  
  if (adminNotes) {
    updateData.adminNotes = adminNotes;
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

