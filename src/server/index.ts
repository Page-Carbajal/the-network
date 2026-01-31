import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAllUsers } from "../data/queries/users.ts";
import { getAllPosts, getPostById, createPost } from "../data/queries/posts.ts";
import { getCommentsByPostId, createComment } from "../data/queries/comments.ts";
import { getLikesCount, toggleLike, hasUserLikedPost } from "../data/queries/likes.ts";
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

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
