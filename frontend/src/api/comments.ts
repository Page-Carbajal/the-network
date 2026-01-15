import type { CommentWithAuthor } from "../../../src/types/index.ts";

const API_BASE_URL = "/api";

export async function fetchCommentsByPostId(postId: number): Promise<CommentWithAuthor[]> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

export async function createComment(
  postId: number,
  userId: number,
  content: string
): Promise<CommentWithAuthor> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, content }),
  });
  if (!response.ok) {
    throw new Error("Failed to create comment");
  }
  return response.json();
}
