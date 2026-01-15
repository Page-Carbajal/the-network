import type { User } from "../../../src/types/index.ts";

const API_BASE_URL = "/api";

export interface FollowersResponse {
  userId: number;
  followers: User[];
  count: number;
}

export interface FollowingResponse {
  userId: number;
  following: User[];
  count: number;
}

export async function fetchFollowers(userId: number): Promise<FollowersResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`);
  if (!response.ok) {
    throw new Error("Failed to fetch followers");
  }
  return response.json();
}

export async function fetchFollowing(userId: number): Promise<FollowingResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/following`);
  if (!response.ok) {
    throw new Error("Failed to fetch following");
  }
  return response.json();
}

export async function followUser(followerId: number, followingId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${followingId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ followerId }),
  });
  if (!response.ok) {
    throw new Error("Failed to follow user");
  }
}

export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${followingId}/follow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ followerId }),
  });
  if (!response.ok) {
    throw new Error("Failed to unfollow user");
  }
}
