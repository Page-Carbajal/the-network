import type { PostWithAuthor } from "../../../src/types/index.ts";

const API_BASE_URL = "/api";

export async function fetchPosts(): Promise<PostWithAuthor[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

export async function fetchPostById(id: number): Promise<PostWithAuthor> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
}

export async function createPost(userId: number, content: string): Promise<PostWithAuthor> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, content }),
  });
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
}

export async function getPostsByUserId(userId: number): Promise<PostWithAuthor[]> {
  // Note: This endpoint doesn't exist yet, but we can filter client-side for now
  const allPosts = await fetchPosts();
  return allPosts.filter((post) => post.userId === userId);
}
