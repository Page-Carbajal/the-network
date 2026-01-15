import { getDb } from "../db/index.ts";
import type { Comment, CommentWithAuthor } from "../../types/index.ts";
import { getUserById } from "./users.ts";

/**
 * Get all comments for a post with author information
 */
export function getCommentsByPostId(postId: number): CommentWithAuthor[] {
  const db = getDb();
  const rows = db.query<[number, number, number, string, string]>(
    `SELECT id, post_id, user_id, content, created_at 
     FROM comments 
     WHERE post_id = ? 
     ORDER BY created_at ASC`,
    [postId]
  );

  return rows.map((row) => {
    const author = getUserById(row[2]);
    if (!author) {
      throw new Error(`User with id ${row[2]} not found`);
    }

    return {
      id: row[0],
      postId: row[1],
      userId: row[2],
      content: row[3],
      createdAt: row[4],
      author,
    };
  });
}

/**
 * Get a comment by ID with author information
 */
export function getCommentById(id: number): CommentWithAuthor | null {
  const db = getDb();
  const rows = db.query<[number, number, number, string, string]>(
    `SELECT id, post_id, user_id, content, created_at 
     FROM comments 
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const author = getUserById(row[2]);
  if (!author) {
    throw new Error(`User with id ${row[2]} not found`);
  }

  return {
    id: row[0],
    postId: row[1],
    userId: row[2],
    content: row[3],
    createdAt: row[4],
    author,
  };
}

/**
 * Create a new comment
 */
export function createComment(comment: {
  postId: number;
  userId: number;
  content: string;
}): Comment {
  const db = getDb();
  const result = db.query(
    `INSERT INTO comments (post_id, user_id, content, created_at) 
     VALUES (?, ?, ?, datetime('now')) 
     RETURNING id, post_id, user_id, content, created_at`,
    [comment.postId, comment.userId, comment.content]
  );

  const row = result[0] as [number, number, number, string, string];
  return {
    id: row[0],
    postId: row[1],
    userId: row[2],
    content: row[3],
    createdAt: row[4],
  };
}

/**
 * Delete a comment
 */
export function deleteComment(id: number): boolean {
  const db = getDb();
  const result = db.query("DELETE FROM comments WHERE id = ?", [id]);
  return result.length > 0;
}
