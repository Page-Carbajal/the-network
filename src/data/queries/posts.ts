import { getDb } from "../db/index.ts";
import type { Post, PostWithAuthor, User } from "../../types/index.ts";
import { getUserById } from "./users.ts";

/**
 * Get all posts with author information
 */
export function getAllPosts(): PostWithAuthor[] {
  const db = getDb();
  const rows = db.query<[number, number, string, string]>(
    `SELECT id, user_id, content, created_at 
     FROM posts 
     ORDER BY created_at DESC`
  );

  return rows.map((row) => {
    const author = getUserById(row[1]);
    if (!author) {
      throw new Error(`User with id ${row[1]} not found`);
    }

    // Get likes count
    const likesCount = db.query<[number]>(
      "SELECT COUNT(*) FROM likes WHERE post_id = ?",
      [row[0]]
    )[0]?.[0] ?? 0;

    // Get comments count
    const commentsCount = db.query<[number]>(
      "SELECT COUNT(*) FROM comments WHERE post_id = ?",
      [row[0]]
    )[0]?.[0] ?? 0;

    return {
      id: row[0],
      userId: row[1],
      content: row[2],
      createdAt: row[3],
      author,
      likesCount,
      commentsCount,
    };
  });
}

/**
 * Get a post by ID with author information
 */
export function getPostById(id: number): PostWithAuthor | null {
  const db = getDb();
  const rows = db.query<[number, number, string, string]>(
    `SELECT id, user_id, content, created_at 
     FROM posts 
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const author = getUserById(row[1]);
  if (!author) {
    throw new Error(`User with id ${row[1]} not found`);
  }

  // Get likes count
  const likesCount = db.query<[number]>(
    "SELECT COUNT(*) FROM likes WHERE post_id = ?",
    [row[0]]
  )[0]?.[0] ?? 0;

  // Get comments count
  const commentsCount = db.query<[number]>(
    "SELECT COUNT(*) FROM comments WHERE post_id = ?",
    [row[0]]
  )[0]?.[0] ?? 0;

  return {
    id: row[0],
    userId: row[1],
    content: row[2],
    createdAt: row[3],
    author,
    likesCount,
    commentsCount,
  };
}

/**
 * Get posts by user ID
 */
export function getPostsByUserId(userId: number): PostWithAuthor[] {
  const db = getDb();
  const rows = db.query<[number, number, string, string]>(
    `SELECT id, user_id, content, created_at 
     FROM posts 
     WHERE user_id = ? 
     ORDER BY created_at DESC`,
    [userId]
  );

  const author = getUserById(userId);
  if (!author) {
    throw new Error(`User with id ${userId} not found`);
  }

  return rows.map((row) => {
    // Get likes count
    const likesCount = db.query<[number]>(
      "SELECT COUNT(*) FROM likes WHERE post_id = ?",
      [row[0]]
    )[0]?.[0] ?? 0;

    // Get comments count
    const commentsCount = db.query<[number]>(
      "SELECT COUNT(*) FROM comments WHERE post_id = ?",
      [row[0]]
    )[0]?.[0] ?? 0;

    return {
      id: row[0],
      userId: row[1],
      content: row[2],
      createdAt: row[3],
      author,
      likesCount,
      commentsCount,
    };
  });
}

/**
 * Create a new post
 */
export function createPost(post: { userId: number; content: string }): Post {
  const db = getDb();
  const result = db.query(
    `INSERT INTO posts (user_id, content, created_at) 
     VALUES (?, ?, datetime('now')) 
     RETURNING id, user_id, content, created_at`,
    [post.userId, post.content]
  );

  const row = result[0] as [number, number, string, string];
  return {
    id: row[0],
    userId: row[1],
    content: row[2],
    createdAt: row[3],
  };
}

/**
 * Delete a post
 */
export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.query("DELETE FROM posts WHERE id = ?", [id]);
  return result.length > 0;
}
