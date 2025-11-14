import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Better Auth component manages auth tables automatically (betterAuth/*)
// This schema defines custom application tables only

export default defineSchema({
  // GitHub repository connections (Epic 3)
  githubConnections: defineTable({
    userId: v.string(), // References betterAuth/user._id
    accessToken: v.string(), // Encrypted by Convex at rest
    repoOwner: v.string(),
    repoName: v.string(),
    branch: v.string(), // Default: "main"
    framework: v.union(
      v.literal("nextjs"),
      v.literal("astro"),
      v.literal("nuxt")
    ),
    connectedAt: v.number(), // Unix timestamp (seconds)
  }).index("by_userId", ["userId"]),

  // Blog posts (Epic 4, 5, 6, 7)
  blogs: defineTable({
    userId: v.string(), // References betterAuth/user._id
    title: v.string(),
    slug: v.string(),
    content: v.string(), // MDX format
    frontmatter: v.object({
      title: v.string(),
      description: v.string(),
      date: v.string(),
      tags: v.array(v.string()),
      image: v.string(),
      seoScore: v.number(),
    }),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("failed")
    ),
    seoScore: v.number(), // 0-100
    sources: v.array(
      v.object({
        url: v.string(),
        title: v.string(),
        snippet: v.string(),
      })
    ),
    heroImageUrl: v.optional(v.string()),
    scheduledFor: v.optional(v.number()), // Unix timestamp
    publishedAt: v.optional(v.number()), // Unix timestamp
    createdAt: v.number(), // Unix timestamp
    updatedAt: v.number(), // Unix timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_scheduledFor", ["scheduledFor"])
    .index("by_userId_status", ["userId", "status"]),

  // Real-time AI generation progress (Epic 4)
  generationProgress: defineTable({
    blogId: v.string(), // References blogs._id
    userId: v.string(), // For access control
    phase: v.union(
      v.literal("analyzing"),
      v.literal("researching"),
      v.literal("generating"),
      v.literal("image"),
      v.literal("complete"),
      v.literal("failed")
    ),
    percentage: v.number(), // 0-100
    logs: v.array(v.string()), // Step-by-step progress logs
    estimatedTimeRemaining: v.optional(v.number()), // seconds
    errorMessage: v.optional(v.string()), // If phase=failed
    createdAt: v.number(), // Unix timestamp
    updatedAt: v.number(), // Unix timestamp
  })
    .index("by_blogId", ["blogId"])
    .index("by_userId", ["userId"]),

  // Subscription and usage tracking (Epic 9)
  subscriptions: defineTable({
    userId: v.string(), // References betterAuth/user._id (unique)
    tier: v.union(v.literal("free"), v.literal("pro")),
    blogsUsed: v.number(), // Current month usage count
    blogsLimit: v.number(), // Monthly limit (3 for free, unlimited for pro)
    quotaResetDate: v.number(), // Unix timestamp (first of next month)
    autumnCustomerId: v.optional(v.string()), // Autumn billing integration
    subscriptionStartDate: v.optional(v.number()), // When upgraded to pro
    cancelledAt: v.optional(v.number()), // Pro cancellation timestamp
    createdAt: v.number(), // Unix timestamp
  })
    .index("by_userId", ["userId"])
    .index("by_quotaResetDate", ["quotaResetDate"]),
});
