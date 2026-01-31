import { DB } from "jsr:@db/sqlite@^0.12.0";
import { join } from "jsr:@std/path@^1.0.0";

const dbPath = join(Deno.cwd(), "src/data/db", "social_media.db");

let dbInstance: DB | null = null;

/**
 * Get or create the SQLite database instance
 */
export function getDb(): DB {
  if (!dbInstance) {
    // Ensure the directory exists
    const dbDir = join(Deno.cwd(), "src/data/db");
    try {
      Deno.mkdirSync(dbDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
    
    dbInstance = new DB(dbPath);
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
