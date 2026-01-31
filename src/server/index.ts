import { Hono } from "hono";

const app = new Hono();

// Basic health check endpoint
app.get("/", (c) => {
  return c.json({ message: "Social Media Platform API" });
});

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
