import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getAllCollections, getCollectionById, createOrder, getAllOrders, getOrderById, updateOrderStatus, getAuditLogs } from "./db";
import { aiRouter } from "./aiRouter";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getProductById(input.id);
      }),
  }),

  collections: router({
    list: publicProcedure.query(async () => {
      return await getAllCollections();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getCollectionById(input.id);
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string(),
        customerWhatsapp: z.string().optional(),
        shippingCity: z.string(),
        shippingAddress: z.string().optional(),
        shippingCountry: z.string().default('UAE'),
        productId: z.string(),
        selectedColor: z.string().optional(),
        selectedSize: z.string().optional(),
        customMeasurements: z.any().optional(),
        customerNotes: z.string().optional(),
        basePrice: z.number(),
        customizationFee: z.number().default(0),
        totalPrice: z.number(),
        depositAmount: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const orderId = await createOrder(input);
        return { success: true, orderId };
      }),

    list: protectedProcedure.query(async () => {
      return await getAllOrders();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getOrderById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        orderId: z.string(),
        status: z.string(),
        adminNotes: z.string().optional(),
        rejectionReason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.orderId, input.status, input.adminNotes, input.rejectionReason);
        return { success: true };
      }),

    approve: protectedProcedure
      .input(z.object({ orderId: z.string() }))
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.orderId, 'approved', 'Approved by admin');
        return { success: true };
      }),

    reject: protectedProcedure
      .input(z.object({ orderId: z.string(), reason: z.string() }))
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.orderId, 'rejected', undefined, input.reason);
        return { success: true };
      }),
  }),

  ai: aiRouter,

  admin: router({
    getStats: protectedProcedure.query(async () => {
      const orders = await getAllOrders();
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const approvedOrders = orders.filter((o: any) => o.status === 'approved').length;
      const totalClients = new Set(orders.map((o: any) => o.customerEmail)).size;
      return { totalOrders, pendingOrders, approvedOrders, totalClients };
    }),

    getClients: protectedProcedure.query(async () => {
      const orders = await getAllOrders();
      const clientMap = new Map();
      orders.forEach((order: any) => {
        if (!clientMap.has(order.customerEmail)) {
          clientMap.set(order.customerEmail, {
            id: order.customerEmail,
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            city: order.shippingCity,
            country: order.shippingCountry,
            totalOrders: 0,
            createdAt: new Date(),
          });
        }
        clientMap.get(order.customerEmail).totalOrders++;
      });
      return Array.from(clientMap.values());
    }),

    getAuditLogs: protectedProcedure
      .input(z.object({
        action: z.string().optional(),
        entityType: z.string().optional(),
        userId: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await getAuditLogs({
          action: input.action,
          entityType: input.entityType,
          userId: input.userId,
          startDate: input.startDate,
          endDate: input.endDate,
          limit: input.limit || 100,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;

