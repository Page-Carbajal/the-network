# Database Migrations

This directory contains SQL migration files for the database schema.

## Migration Naming Convention

Migrations should be named with a zero-padded number prefix followed by a descriptive name:
- `001_create_users.sql`
- `002_seed_users.sql`
- `003_create_posts.sql`

## Running Migrations

To run all pending migrations:

```bash
deno task migrate
```

Or directly:

```bash
deno run --allow-read --allow-write --allow-env src/data/migrations/migrate.ts
```

## Migration Format

Each migration file should contain valid SQL statements. Multiple statements can be separated by semicolons. The migration runner will execute all statements in a transaction, so if any statement fails, the entire migration will be rolled back.

## Example Migration

```sql
-- Migration 001: Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```
