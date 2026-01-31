import { getDb } from "../db/index.ts";
import type { Follower, User } from "../../types/index.ts";
import { getUserById } from "./users.ts";

/**
 * Get all followers of a user
 */
export function getFollowers(userId: number): User[] {
  const db = getDb();
  const rows = db.query<[number]>(
    `SELECT follower_id 
     FROM followers 
     WHERE following_id = ?`,
    [userId]
  );

  return rows
    .map((row) => getUserById(row[0]))
    .filter((user): user is User => user !== null);
}

/**
 * Get all users that a user is following
 */
export function getFollowing(userId: number): User[] {
  const db = getDb();
  const rows = db.query<[number]>(
    `SELECT following_id 
     FROM followers 
     WHERE follower_id = ?`,
    [userId]
  );

  return rows
    .map((row) => getUserById(row[0]))
    .filter((user): user is User => user !== null);
}

/**
 * Get followers count
 */
export function getFollowersCount(userId: number): number {
  const db = getDb();
  const rows = db.query<[number]>(
    "SELECT COUNT(*) FROM followers WHERE following_id = ?",
    [userId]
  );
  return rows[0]?.[0] ?? 0;
}

/**
 * Get following count
 */
export function getFollowingCount(userId: number): number {
  const db = getDb();
  const rows = db.query<[number]>(
    "SELECT COUNT(*) FROM followers WHERE follower_id = ?",
    [userId]
  );
  return rows[0]?.[0] ?? 0;
}

/**
 * Check if a user is following another user
 */
export function isFollowing(followerId: number, followingId: number): boolean {
  if (followerId === followingId) {
    return false;
  }

  const db = getDb();
  const rows = db.query<[number]>(
    "SELECT COUNT(*) FROM followers WHERE follower_id = ? AND following_id = ?",
    [followerId, followingId]
  );
  return (rows[0]?.[0] ?? 0) > 0;
}

/**
 * Follow a user
 */
export function followUser(followerId: number, followingId: number): Follower {
  if (followerId === followingId) {
    throw new Error("User cannot follow themselves");
  }

  const db = getDb();
  
  // Check if already following
  if (isFollowing(followerId, followingId)) {
    throw new Error("Already following this user");
  }

  const result = db.query(
    `INSERT INTO followers (follower_id, following_id, created_at) 
     VALUES (?, ?, datetime('now')) 
     RETURNING id, follower_id, following_id, created_at`,
    [followerId, followingId]
  );

  const row = result[0] as [number, number, number, string];
  return {
    id: row[0],
    followerId: row[1],
    followingId: row[2],
    createdAt: row[3],
  };
}

/**
 * Unfollow a user
 */
export function unfollowUser(followerId: number, followingId: number): boolean {
  const db = getDb();
  const result = db.query(
    "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
    [followerId, followingId]
  );
  return result.length > 0;
}
