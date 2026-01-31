import { getDb } from "../db/index.ts";
import type { Like } from "../../types/index.ts";

/**
 * Get likes count for a post
 */
export function getLikesCount(postId: number): number {
  const db = getDb();
  const rows = db.query<[number]>(
    "SELECT COUNT(*) FROM likes WHERE post_id = ?",
    [postId]
  );
  return rows[0]?.[0] ?? 0;
}

/**
 * Check if a user has liked a post
 */
export function hasUserLikedPost(postId: number, userId: number): boolean {
  const db = getDb();
  const rows = db.query<[number]>(
    "SELECT COUNT(*) FROM likes WHERE post_id = ? AND user_id = ?",
    [postId, userId]
  );
  return (rows[0]?.[0] ?? 0) > 0;
}

/**
 * Toggle like on a post (like if not liked, unlike if already liked)
 */
export function toggleLike(postId: number, userId: number): { liked: boolean; like: Like | null } {
  const db = getDb();
  
  // Check if already liked
  const existing = hasUserLikedPost(postId, userId);
  
  if (existing) {
    // Unlike: delete the like
    db.query("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [postId, userId]);
    return { liked: false, like: null };
  } else {
    // Like: create the like
    const result = db.query(
      `INSERT INTO likes (post_id, user_id, created_at) 
       VALUES (?, ?, datetime('now')) 
       RETURNING id, post_id, user_id, created_at`,
      [postId, userId]
    );
    
    const row = result[0] as [number, number, number, string];
    const like: Like = {
      id: row[0],
      postId: row[1],
      userId: row[2],
      createdAt: row[3],
    };
    
    return { liked: true, like };
  }
}

/**
 * Get all likes for a post
 */
export function getLikesByPostId(postId: number): Like[] {
  const db = getDb();
  const rows = db.query<[number, number, number, string]>(
    `SELECT id, post_id, user_id, created_at 
     FROM likes 
     WHERE post_id = ? 
     ORDER BY created_at DESC`,
    [postId]
  );

  return rows.map((row) => ({
    id: row[0],
    postId: row[1],
    userId: row[2],
    createdAt: row[3],
  }));
}
