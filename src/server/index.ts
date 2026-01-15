import { Hono } from "npm:hono@latest";
import { faker } from "npm:@faker-js/faker@latest";

const app = new Hono();

// Generate 10 hardcoded users using faker.js
const users = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  username: faker.internet.username(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  avatar: faker.image.avatar(),
  bio: faker.person.bio(),
  createdAt: faker.date.past().toISOString(),
}));

// Users endpoint
app.get("/users", (c) => {
  return c.json(users);
});

// Start server
const port = 8000;
console.log(`Server is running on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
