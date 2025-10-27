import { router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { codex, manusAI, healthMonitor, orchestrator } from "./aiIntegration";

export const aiRouter = router({
  // Codex Integration
  codex: router({
    analyzeCode: adminProcedure
      .input(z.object({
        code: z.string(),
        context: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await codex.analyzeCode(input.code, input.context || "");
      }),

    generateImprovement: adminProcedure
      .input(z.object({
        file: z.string(),
        suggestion: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await codex.generateImprovement(input.file, input.suggestion);
      }),

    reviewPullRequest: adminProcedure
      .input(z.object({
        changes: z.array(z.string()),
      }))
      .query(async ({ input }) => {
        return await codex.reviewPullRequest(input.changes);
      }),
  }),

  // Manus AI Integration
  manusAI: router({
    processOrder: protectedProcedure
      .input(z.object({
        orderId: z.string(),
        orderData: z.any(),
      }))
      .mutation(async ({ input }) => {
        return await manusAI.processOrder(input.orderId, input.orderData);
      }),

    generateRecommendations: protectedProcedure
      .input(z.object({
        customerId: z.string(),
        orderHistory: z.array(z.any()),
      }))
      .query(async ({ input }) => {
        return await manusAI.generateCustomerRecommendations(
          input.customerId,
          input.orderHistory
        );
      }),

    optimizeInventory: adminProcedure.query(async () => {
      return await manusAI.optimizeInventory();
    }),

    predictChurn: adminProcedure.query(async () => {
      return await manusAI.predictCustomerChurn();
    }),

    analyzeMarketTrends: adminProcedure.query(async () => {
      return await manusAI.analyzeMarketTrends();
    }),
  }),

  // System Health & Monitoring
  health: router({
    check: protectedProcedure.query(async () => {
      return await healthMonitor.checkHealth();
    }),

    metrics: protectedProcedure.query(async () => {
      return healthMonitor.getMetrics();
    }),
  }),

  // Automation Orchestration
  automation: router({
    runDailyTasks: adminProcedure.mutation(async () => {
      await orchestrator.runDailyTasks();
      return { success: true, message: "Daily tasks completed" };
    }),

    syncData: adminProcedure.mutation(async () => {
      await orchestrator.syncData();
      return { success: true, message: "Data sync completed" };
    }),
  }),
});

export type AIRouter = typeof aiRouter;

