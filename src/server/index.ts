import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAllUsers, getUserById } from "../data/queries/users.ts";
import { getAllPosts, getPostById, createPost } from "../data/queries/posts.ts";
import { getCommentsByPostId, createComment } from "../data/queries/comments.ts";
import { getLikesCount, toggleLike, hasUserLikedPost } from "../data/queries/likes.ts";
import { getFollowers, getFollowing, followUser, unfollowUser, getFollowersCount, getFollowingCount } from "../data/queries/followers.ts";
import { createPostSchema, createCommentSchema, likePostSchema } from "../schemas/index.ts";

const app = new Hono();

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
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users!" }, 500);
  }
});

// Posts endpoints
app.get("/posts", (c) => {
  try {
    const posts = getAllPosts();
    return c.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

app.get("/posts/:id", (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid post ID" }, 400);
    }

    const post = getPostById(id);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return c.json({ error: "Failed to fetch post" }, 500);
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
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Comments endpoints
app.get("/posts/:postId/comments", (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post ID" }, 400);
    }

    const comments = getCommentsByPostId(postId);
    return c.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
});

app.post("/posts/:postId/comments", zValidator("json", createCommentSchema), (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post ID" }, 400);
    }

    const data = c.req.valid("json");
    const comment = createComment({
      postId,
      userId: data.userId,
      content: data.content,
    });
    return c.json(comment, 201);
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

// Likes endpoints
app.get("/posts/:postId/likes", (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post ID" }, 400);
    }

    const count = getLikesCount(postId);
    return c.json({ postId, likesCount: count });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return c.json({ error: "Failed to fetch likes" }, 500);
  }
});

app.post("/posts/:postId/likes", zValidator("json", likePostSchema), (c) => {
  try {
    const postId = parseInt(c.req.param("postId"));
    if (isNaN(postId)) {
      return c.json({ error: "Invalid post ID" }, 400);
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
    console.error("Error toggling like:", error);
    return c.json({ error: "Failed to toggle like" }, 500);
  }
});

// Followers endpoints
app.get("/users/:userId/followers", (c) => {
  try {
    const userId = parseInt(c.req.param("userId"));
    if (isNaN(userId)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const followers = getFollowers(userId);
    const count = getFollowersCount(userId);
    return c.json({ userId, followers, count });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return c.json({ error: "Failed to fetch followers" }, 500);
  }
});

app.get("/users/:userId/following", (c) => {
  try {
    const userId = parseInt(c.req.param("userId"));
    if (isNaN(userId)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const following = getFollowing(userId);
    const count = getFollowingCount(userId);
    return c.json({ userId, following, count });
  } catch (error) {
    console.error("Error fetching following:", error);
    return c.json({ error: "Failed to fetch following" }, 500);
  }
});

app.post("/users/:userId/follow", (c) => {
  try {
    const followingId = parseInt(c.req.param("userId"));
    if (isNaN(followingId)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const body = await c.req.json();
    const followerId = body.followerId;

    if (!followerId || typeof followerId !== "number") {
      return c.json({ error: "followerId is required" }, 400);
    }

    if (followerId === followingId) {
      return c.json({ error: "User cannot follow themselves" }, 400);
    }

    const follower = followUser(followerId, followingId);
    return c.json(follower, 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Already following")) {
      return c.json({ error: error.message }, 409);
    }
    console.error("Error following user:", error);
    return c.json({ error: "Failed to follow user" }, 500);
  }
});

app.delete("/users/:userId/follow", (c) => {
  try {
    const followingId = parseInt(c.req.param("userId"));
    if (isNaN(followingId)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const body = await c.req.json();
    const followerId = body.followerId;

    if (!followerId || typeof followerId !== "number") {
      return c.json({ error: "followerId is required" }, 400);
    }

    const success = unfollowUser(followerId, followingId);
    if (!success) {
      return c.json({ error: "Not following this user" }, 404);
    }

    return c.json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return c.json({ error: "Failed to unfollow user" }, 500);
  }
});

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
