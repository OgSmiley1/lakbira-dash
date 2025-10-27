import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getAllCollections, getCollectionById, createCollection, updateCollectionMedia, createOrder, getAllOrders, getOrderById, updateOrderStatus, createRegistration, getAllRegistrations, updateRegistrationStatus, updateProductDetails } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

function assertAdmin(role?: string) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

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
    list: publicProcedure
      .input(z.object({ locale: z.enum(["en", "ar"]).default("en") }).optional())
      .query(async ({ input }) => {
        return await getAllProducts(input?.locale ?? "en");
      }),

    getById: publicProcedure
      .input(
        z.object({
          id: z.string(),
          locale: z.enum(["en", "ar"]).default("en"),
        })
      )
      .query(async ({ input }) => {
        return await getProductById(input.id, input.locale);
      }),

    updateDetails: protectedProcedure
      .input(
        z.object({
          productId: z.string(),
          basePrice: z.number().int().optional(),
          images: z.array(z.string()).optional(),
          availableColors: z
            .array(
              z.object({
                hex: z.string(),
                name: z.string().optional(),
                nameAr: z.string().optional(),
              }),
            )
            .optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        assertAdmin(ctx.user?.role);

        await updateProductDetails(input.productId, {
          basePrice: input.basePrice,
          images: input.images,
          availableColors: input.availableColors,
        });

        return { success: true } as const;
      }),
  }),

  collections: router({
    list: publicProcedure
      .input(z.object({ locale: z.enum(["en", "ar"]).default("en") }).optional())
      .query(async ({ input }) => {
        return await getAllCollections(input?.locale ?? "en");
      }),

    getById: publicProcedure
      .input(
        z.object({
          id: z.string(),
          locale: z.enum(["en", "ar"]).default("en"),
        })
      )
      .query(async ({ input }) => {
        return await getCollectionById(input.id, input.locale);
      }),

    create: protectedProcedure
      .input(
        z.object({
          nameEn: z.string(),
          nameAr: z.string(),
          descriptionEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          storyEn: z.string().optional(),
          storyAr: z.string().optional(),
          coverImage: z.string().optional(),
          videoUrl: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        assertAdmin(ctx.user?.role);
        const collectionId = await createCollection({
          ...input,
        });
        return { success: true, collectionId } as const;
      }),

    updateMedia: protectedProcedure
      .input(
        z.object({
          collectionId: z.string(),
          videoUrl: z.string().optional(),
          coverImage: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        assertAdmin(ctx.user?.role);
        await updateCollectionMedia(input.collectionId, {
          videoUrl: input.videoUrl,
          coverImage: input.coverImage,
        });
        return { success: true } as const;
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
        locale: z.enum(["en", "ar"]).default("en"),
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

  registrations: router({
    create: publicProcedure
      .input(z.object({
        fullName: z.string(),
        email: z.string().email().optional(),
        phone: z.string(),
        city: z.string().optional(),
        country: z.string().default("UAE"),
        preferredLanguage: z.enum(["en", "ar"]).default("en"),
        notes: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const registrationId = await createRegistration(input);
        return { success: true, registrationId };
      }),

    list: protectedProcedure.query(async () => {
      return await getAllRegistrations();
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        registrationId: z.string(),
        status: z.enum(["new", "confirmed", "waitlisted", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateRegistrationStatus(input.registrationId, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

