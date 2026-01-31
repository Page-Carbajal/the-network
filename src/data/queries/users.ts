import { getDb } from "../db/index.ts";
import type { User } from "../../types/index.ts";

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  const db = getDb();
  const rows = db.query<[number, string, string, string, string, string | null, string | null, string]>(
    `SELECT id, username, email, first_name, last_name, avatar, bio, created_at 
     FROM users 
     ORDER BY created_at DESC`
  );

  return rows.map((row) => ({
    id: row[0],
    username: row[1],
    email: row[2],
    firstName: row[3],
    lastName: row[4],
    avatar: row[5],
    bio: row[6],
    createdAt: row[7],
  }));
}

/**
 * Get a user by ID
 */
export function getUserById(id: number): User | null {
  const db = getDb();
  const rows = db.query<[number, string, string, string, string, string | null, string | null, string]>(
    `SELECT id, username, email, first_name, last_name, avatar, bio, created_at 
     FROM users 
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row[0],
    username: row[1],
    email: row[2],
    firstName: row[3],
    lastName: row[4],
    avatar: row[5],
    bio: row[6],
    createdAt: row[7],
  };
}

/**
 * Get a user by username
 */
export function getUserByUsername(username: string): User | null {
  const db = getDb();
  const rows = db.query<[number, string, string, string, string, string | null, string | null, string]>(
    `SELECT id, username, email, first_name, last_name, avatar, bio, created_at 
     FROM users 
     WHERE username = ?`,
    [username]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    id: row[0],
    username: row[1],
    email: row[2],
    firstName: row[3],
    lastName: row[4],
    avatar: row[5],
    bio: row[6],
    createdAt: row[7],
  };
}

/**
 * Create a new user
 */
export function createUser(user: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  bio?: string | null;
}): User {
  const db = getDb();
  const result = db.query(
    `INSERT INTO users (username, email, first_name, last_name, avatar, bio, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, datetime('now')) 
     RETURNING id, username, email, first_name, last_name, avatar, bio, created_at`,
    [user.username, user.email, user.firstName, user.lastName, user.avatar || null, user.bio || null]
  );

  const row = result[0] as [number, string, string, string, string, string | null, string | null, string];
  return {
    id: row[0],
    username: row[1],
    email: row[2],
    firstName: row[3],
    lastName: row[4],
    avatar: row[5],
    bio: row[6],
    createdAt: row[7],
  };
}

/**
 * Get user count
 */
export function getUserCount(): number {
  const db = getDb();
  const rows = db.query<[number]>("SELECT COUNT(*) FROM users");
  return rows[0]?.[0] ?? 0;
}
