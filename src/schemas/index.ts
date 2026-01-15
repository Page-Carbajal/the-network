import { z } from "zod";

/**
 * Zod validation schemas for the social media platform
 */

// User schemas
export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  avatar: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
});

export const updateUserSchema = createUserSchema.partial();

// Post schemas
export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  userId: z.number().int().positive(),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  userId: z.number().int().positive(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
});

// Like schema (no body needed, just postId and userId from params)
export const likePostSchema = z.object({
  userId: z.number().int().positive(),
});

// Follower schema
export const followUserSchema = z.object({
  followerId: z.number().int().positive(),
  followingId: z.number().int().positive(),
}).refine((data) => data.followerId !== data.followingId, {
  message: "User cannot follow themselves",
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type LikePostInput = z.infer<typeof likePostSchema>;
export type FollowUserInput = z.infer<typeof followUserSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
