import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { getAllUsers, getUserById } from "../data/queries/users.ts";
import { getAllPosts, getPostById, createPost } from "../data/queries/posts.ts";
import { getCommentsByPostId, createComment } from "../data/queries/comments.ts";
import { getLikesCount, toggleLike, hasUserLikedPost } from "../data/queries/likes.ts";
import { getFollowers, getFollowing, followUser, unfollowUser, getFollowersCount, getFollowingCount } from "../data/queries/followers.ts";
import { createPostSchema, createCommentSchema, likePostSchema } from "../schemas/index.ts";
import { corsMiddleware } from "./middleware/cors.ts";
import { logger } from "./middleware/logger.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const app = new Hono();

// Middleware
app.use("*", corsMiddleware);
app.use("*", logger);
app.onError(errorHandler);

// Basic health check endpoint
app.get("/", (c) => {
  return c.json({ message: "Social Media Platform API" });
});

// Users endpoint
app.get("/users", (c) => {
  try {
    const users = getAllUsers();
    return c.json(users);
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch users!" });
  }
});

// Posts endpoints
app.get("/posts", (c) => {
  try {
    const posts = getAllPosts();
    return c.json(posts);
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch posts" });
  }
});

app.get("/posts/:id", (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      throw new HTTPException(400, { message: "Invalid post ID" });
    }

    const post = getPostById(id);
    if (!post) {
      throw new HTTPException(404, { message: "Post not found" });
    }

    return c.json(post);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to fetch post" });
  }
});

app.post("/posts", zValidator("json", createPostSchema), (c) => {
  try {
    const data = c.req.valid("json");
    const post = createPost({
      userId: data.userId,
      content: data.content,
    });
    return c.json(post, 201);
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to create post" });
  }
});

// Comments endpoints
app.get("/posts/:postId/comments", (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      throw new HTTPException(400, { message: "Invalid post ID" });
    }

    const comments = getCommentsByPostId(postId);
    return c.json(comments);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to fetch comments" });
  }
});

app.post("/posts/:postId/comments", zValidator("json", createCommentSchema), (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      throw new HTTPException(400, { message: "Invalid post ID" });
    }

    const data = c.req.valid("json");
    const comment = createComment({
      postId,
      userId: data.userId,
      content: data.content,
    });
    return c.json(comment, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to create comment" });
  }
});

// Likes endpoints
app.get("/posts/:postId/likes", (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      throw new HTTPException(400, { message: "Invalid post ID" });
    }

    const count = getLikesCount(postId);
    return c.json({ postId, likesCount: count });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to fetch likes" });
  }
});

app.post("/posts/:postId/likes", zValidator("json", likePostSchema), (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      throw new HTTPException(400, { message: "Invalid post ID" });
    }

    const data = c.req.valid("json");
    const result = toggleLike(postId, data.userId);
    const count = getLikesCount(postId);
    
    return c.json({
      postId,
      userId: data.userId,
      liked: result.liked,
      likesCount: count,
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to toggle like" });
  }
});

// Followers endpoints
app.get("/users/:userId/followers", (c) => {
  try {
    const userId = parseInt(c.req.param("userId"));
    if (isNaN(userId)) {
      throw new HTTPException(400, { message: "Invalid user ID" });
    }

    const followers = getFollowers(userId);
    const count = getFollowersCount(userId);
    return c.json({ userId, followers, count });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to fetch followers" });
  }
});

app.get("/users/:userId/following", (c) => {
  try {
    const userId = parseInt(c.req.param("userId"));
    if (isNaN(userId)) {
      throw new HTTPException(400, { message: "Invalid user ID" });
    }

    const following = getFollowing(userId);
    const count = getFollowingCount(userId);
    return c.json({ userId, following, count });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to fetch following" });
  }
});

app.post("/users/:userId/follow", async (c) => {
  try {
    const followingId = parseInt(c.req.param("userId"));
    if (isNaN(followingId)) {
      throw new HTTPException(400, { message: "Invalid user ID" });
    }

    const body = await c.req.json();
    const followerId = body.followerId;

    if (!followerId || typeof followerId !== "number") {
      throw new HTTPException(400, { message: "followerId is required" });
    }

    if (followerId === followingId) {
      throw new HTTPException(400, { message: "User cannot follow themselves" });
    }

    const follower = followUser(followerId, followingId);
    return c.json(follower, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("Already following")) {
      throw new HTTPException(409, { message: error.message });
    }
    throw new HTTPException(500, { message: "Failed to follow user" });
  }
});

app.delete("/users/:userId/follow", async (c) => {
  try {
    const followingId = parseInt(c.req.param("userId"));
    if (isNaN(followingId)) {
      throw new HTTPException(400, { message: "Invalid user ID" });
    }

    const body = await c.req.json();
    const followerId = body.followerId;

    if (!followerId || typeof followerId !== "number") {
      throw new HTTPException(400, { message: "followerId is required" });
    }

    const success = unfollowUser(followerId, followingId);
    if (!success) {
      throw new HTTPException(404, { message: "Not following this user" });
    }

    return c.json({ message: "Unfollowed successfully" });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(500, { message: "Failed to unfollow user" });
  }
});

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
