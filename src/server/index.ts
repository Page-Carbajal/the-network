import { Hono } from "hono";
import { getAllUsers } from "../data/queries/users.ts";

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

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
