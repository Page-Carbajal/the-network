const API_BASE_URL = "/api";

export interface LikesResponse {
  postId: number;
  likesCount: number;
}

export interface ToggleLikeResponse {
  postId: number;
  userId: number;
  liked: boolean;
  likesCount: number;
}

export async function fetchLikesCount(postId: number): Promise<LikesResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`);
  if (!response.ok) {
    throw new Error("Failed to fetch likes");
  }
  return response.json();
}

export async function toggleLike(postId: number, userId: number): Promise<ToggleLikeResponse> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }
  return response.json();
}
