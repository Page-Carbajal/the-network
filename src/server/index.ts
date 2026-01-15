import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getAllUsers } from "../data/queries/users.ts";
import { getAllPosts, getPostById, createPost } from "../data/queries/posts.ts";
import { createPostSchema } from "../schemas/index.ts";

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
    return c.json({ error: "Failed to fetch users" }, 500);
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

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
