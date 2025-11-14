import { betterAuth } from "better-auth";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // Disable logging when createAuth is called just to generate options
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    
    // Email/password auth (enabled in Story 2.1)
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        // Password reset will be implemented in Story 2.3
        console.log(`Password reset for ${user.email}: ${url}`);
      },
    },
    
    // GitHub OAuth configuration
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        // Request repo scope for publishing blogs
        scope: ["read:user", "user:email", "repo"],
      },
    },
    
    // Session configuration (7-day expiry)
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
      updateAge: 60 * 60 * 24, // Refresh daily
    },
    
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

// Helper function to get the current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

// Safe version that returns undefined instead of throwing
export const safeGetCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.safeGetAuthUser(ctx);
  },
});

// Create free tier subscription for new user (Story 2.1)
export const createFreeSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    
    if (!authUser) {
      throw new Error("Not authenticated");
    }
    
    // Use userId if available (for Better Auth users), otherwise use _id
    const userId = authUser.userId || authUser._id.toString();
    
    // Check if subscription already exists
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (existingSub) {
      return existingSub._id;
    }
    
    // Calculate first day of next month for quota reset
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);
    
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId,
      tier: "free",
      blogsUsed: 0,
      blogsLimit: 3,
      quotaResetDate: Math.floor(nextMonth.getTime() / 1000),
      subscriptionStartDate: Math.floor(Date.now() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    return subscriptionId;
  },
});
