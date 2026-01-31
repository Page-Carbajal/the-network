/**
 * Type definitions for the social media platform
 */

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface Follower {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

// Extended types with related data
export interface PostWithAuthor extends Post {
  author: User;
  likesCount: number;
  commentsCount: number;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface UserWithStats extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
