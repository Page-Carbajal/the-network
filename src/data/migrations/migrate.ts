import { getDb, closeDb } from "../db/index.ts";
import { join } from "jsr:@std/path@^1.0.0";
import { readDir } from "jsr:@std/fs@^1.0.0";

interface Migration {
  filename: string;
  number: number;
  path: string;
}

/**
 * Get all migration files sorted by number
 */
async function getMigrations(): Promise<Migration[]> {
  const migrationsDir = join(Deno.cwd(), "src/data/migrations");
  const migrations: Migration[] = [];

  try {
    for await (const entry of readDir(migrationsDir)) {
      if (entry.isFile && entry.name.endsWith(".sql")) {
        const match = entry.name.match(/^(\d+)_(.+)\.sql$/);
        if (match) {
          migrations.push({
            filename: entry.name,
            number: parseInt(match[1], 10),
            path: join(migrationsDir, entry.name),
          });
        }
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.log("Migrations directory not found, creating it...");
      Deno.mkdirSync(migrationsDir, { recursive: true });
      return [];
    }
    throw error;
  }

  return migrations.sort((a, b) => a.number - b.number);
}

/**
 * Check if a migration has been run
 */
function isMigrationRun(db: ReturnType<typeof getDb>, migrationNumber: number): boolean {
  try {
    const result = db.query(
      "SELECT 1 FROM migrations WHERE number = ?",
      [migrationNumber]
    );
    return result.length > 0;
  } catch {
    // migrations table doesn't exist yet
    return false;
  }
}

/**
 * Mark a migration as run
 */
function markMigrationRun(db: ReturnType<typeof getDb>, migrationNumber: number, filename: string): void {
  db.query(
    "INSERT INTO migrations (number, filename, run_at) VALUES (?, ?, datetime('now'))",
    [migrationNumber, filename]
  );
}

/**
 * Run all pending migrations
 */
async function runMigrations(): Promise<void> {
  const db = getDb();

  // Create migrations table if it doesn't exist
  db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      number INTEGER PRIMARY KEY,
      filename TEXT NOT NULL,
      run_at TEXT NOT NULL
    )
  `);

  const migrations = await getMigrations();
  let runCount = 0;

  for (const migration of migrations) {
    if (isMigrationRun(db, migration.number)) {
      console.log(`✓ Migration ${migration.filename} already run`);
      continue;
    }

    console.log(`Running migration ${migration.filename}...`);
    const sql = await Deno.readTextFile(migration.path);
    
    // Execute migration in a transaction
    db.query("BEGIN");
    try {
      // Split by semicolon and execute each statement
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        db.query(statement);
      }

      markMigrationRun(db, migration.number, migration.filename);
      db.query("COMMIT");
      runCount++;
      console.log(`✓ Migration ${migration.filename} completed`);
    } catch (error) {
      db.query("ROLLBACK");
      console.error(`✗ Migration ${migration.filename} failed:`, error);
      throw error;
    }
  }

  if (runCount === 0) {
    console.log("No new migrations to run");
  } else {
    console.log(`\n✓ ${runCount} migration(s) completed successfully`);
  }

  closeDb();
}

// Run migrations if this file is executed directly
if (import.meta.main) {
  try {
    await runMigrations();
    Deno.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    Deno.exit(1);
  }
}

export { runMigrations };
