import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getAllCollections, getCollectionById, createOrder, getAllOrders, getOrderById, updateOrderStatus } from "./db";
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
  }),
});

export type AppRouter = typeof appRouter;

