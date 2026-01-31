import { getDb, closeDb } from "./db/index.ts";
import { faker } from "@faker-js/faker";
import { createUser } from "./queries/users.ts";

/**
 * Seed the database with fake data
 */
async function seedDatabase() {
  const db = getDb();

  console.log("Starting database seed...");

  // Check if users already exist
  const existingUsers = db.query<[number]>("SELECT COUNT(*) FROM users");
  if (existingUsers[0]?.[0] && existingUsers[0][0] > 0) {
    console.log("Database already seeded. Skipping...");
    closeDb();
    return;
  }

  // Generate 10 users
  console.log("Generating 10 users...");
  for (let i = 0; i < 10; i++) {
    const user = createUser({
      username: faker.internet.username(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
      bio: faker.person.bio(),
    });
    console.log(`Created user: ${user.username} (ID: ${user.id})`);
  }

  console.log("✓ Database seed completed successfully");
  closeDb();
}

// Run seed if this file is executed directly
if (import.meta.main) {
  try {
    await seedDatabase();
    Deno.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    Deno.exit(1);
  }
}

export { seedDatabase };
