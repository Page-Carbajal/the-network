# Implementation Plan: Social Media Platform API

## Overview
This plan outlines the implementation of a social media platform API following the specifications in AGENTS.md. The implementation will be broken down into logical, stackable PRs using Graphite.

## Current State
- ✅ Basic Hono server setup (`src/server/index.ts`)
- ✅ `/users` endpoint returning 10 hardcoded faker-generated users
- Current branch: `feature/hono-api`

## Implementation Stack (Bottom to Top)

### PR 1: Database Setup & Configuration
**Base:** `feature/hono-api`
**Purpose:** Set up SQLite database infrastructure and Deno configuration

**Tasks:**
- Create `deno.json` with dependencies and configuration
- Set up SQLite database connection utilities (`src/data/db/index.ts`)
- Create database initialization script
- Add `.gitignore` entries for database files
- Create `src/data/db/schema.sql` with table definitions

**Files to create:**
- `deno.json`
- `src/data/db/index.ts`
- `src/data/db/schema.sql`
- Update `.gitignore`

---

### PR 2: Database Migrations System
**Base:** PR 1
**Purpose:** Implement migration system for database schema management

**Tasks:**
- Create migration runner (`src/data/migrations/migrate.ts`)
- Create initial migration for users table
- Add migration utilities and helpers
- Document migration workflow

**Files to create:**
- `src/data/migrations/migrate.ts`
- `src/data/migrations/001_create_users.sql`
- `src/data/migrations/README.md`

---

### PR 3: Data Models & Zod Schemas
**Base:** PR 2
**Purpose:** Define TypeScript types and Zod validation schemas for all entities

**Tasks:**
- Create type definitions for User, Post, Comment, Like, Follower
- Create Zod schemas for validation
- Create shared types file
- Export schemas for use in API endpoints

**Files to create:**
- `src/types/index.ts`
- `src/schemas/index.ts`

---

### PR 4: Users Table Migration & Seed Data
**Base:** PR 3
**Purpose:** Complete users table setup with seed data

**Tasks:**
- Create users table migration
- Create seed script to populate users table with faker data
- Update users endpoint to read from database instead of hardcoded array
- Add database queries for users (`src/data/queries/users.ts`)

**Files to create:**
- `src/data/migrations/002_seed_users.sql` (or seed script)
- `src/data/queries/users.ts`
- `src/data/seed.ts` (optional)

**Files to modify:**
- `src/server/index.ts` (update users endpoint)

---

### PR 5: Posts API Endpoints
**Base:** PR 4
**Purpose:** Implement posts table and API endpoints

**Tasks:**
- Create posts table migration
- Create posts queries (`src/data/queries/posts.ts`)
- Implement GET `/posts` endpoint (list all posts)
- Implement GET `/posts/:id` endpoint (get single post)
- Implement POST `/posts` endpoint (create post)
- Add Zod validation for post creation

**Files to create:**
- `src/data/migrations/003_create_posts.sql`
- `src/data/queries/posts.ts`

**Files to modify:**
- `src/server/index.ts` (add posts routes)

---

### PR 6: Comments API Endpoints
**Base:** PR 5
**Purpose:** Implement comments functionality

**Tasks:**
- Create comments table migration
- Create comments queries (`src/data/queries/comments.ts`)
- Implement GET `/posts/:postId/comments` endpoint
- Implement POST `/posts/:postId/comments` endpoint
- Add Zod validation for comment creation

**Files to create:**
- `src/data/migrations/004_create_comments.sql`
- `src/data/queries/comments.ts`

**Files to modify:**
- `src/server/index.ts` (add comments routes)

---

### PR 7: Likes API Endpoints
**Base:** PR 6
**Purpose:** Implement likes functionality

**Tasks:**
- Create likes table migration
- Create likes queries (`src/data/queries/likes.ts`)
- Implement POST `/posts/:postId/likes` endpoint (like/unlike)
- Implement GET `/posts/:postId/likes` endpoint (get likes count)
- Add validation to prevent duplicate likes

**Files to create:**
- `src/data/migrations/005_create_likes.sql`
- `src/data/queries/likes.ts`

**Files to modify:**
- `src/server/index.ts` (add likes routes)

---

### PR 8: Followers API Endpoints
**Base:** PR 7
**Purpose:** Implement followers/following functionality

**Tasks:**
- Create followers table migration
- Create followers queries (`src/data/queries/followers.ts`)
- Implement POST `/users/:userId/follow` endpoint
- Implement DELETE `/users/:userId/follow` endpoint (unfollow)
- Implement GET `/users/:userId/followers` endpoint
- Implement GET `/users/:userId/following` endpoint
- Add validation to prevent self-follow

**Files to create:**
- `src/data/migrations/006_create_followers.sql`
- `src/data/queries/followers.ts`

**Files to modify:**
- `src/server/index.ts` (add followers routes)

---

### PR 9: Frontend Setup & Configuration
**Base:** PR 8
**Purpose:** Set up frontend build system and basic structure

**Tasks:**
- Create frontend directory structure
- Set up React with Vite or similar build tool
- Configure Tailwind CSS
- Create basic HTML entry point
- Set up development scripts in `deno.json`

**Files to create:**
- `frontend/` directory structure
- `frontend/index.html`
- `frontend/vite.config.ts` (or similar)
- `frontend/tailwind.config.js`
- `frontend/package.json` (if needed) or update `deno.json`

---

### PR 10: Frontend - User List Component
**Base:** PR 9
**Purpose:** Create React component to display users

**Tasks:**
- Create UserList component
- Fetch users from API
- Display users with avatars, names, bios
- Add basic styling with Tailwind CSS
- Handle loading and error states

**Files to create:**
- `frontend/src/components/UserList.tsx`
- `frontend/src/api/users.ts` (API client)

---

### PR 11: Frontend - Posts Feed Component
**Base:** PR 10
**Purpose:** Create React component to display posts feed

**Tasks:**
- Create PostFeed component
- Fetch posts from API
- Display posts with author info, content, timestamps
- Add styling with Tailwind CSS
- Handle loading and error states

**Files to create:**
- `frontend/src/components/PostFeed.tsx`
- `frontend/src/api/posts.ts` (API client)

---

### PR 12: Frontend - Post Interactions (Comments & Likes)
**Base:** PR 11
**Purpose:** Add interactive features for posts

**Tasks:**
- Create CommentList component
- Create LikeButton component
- Add ability to view comments on posts
- Add ability to like/unlike posts
- Update UI to show like counts
- Add styling for interactions

**Files to create:**
- `frontend/src/components/CommentList.tsx`
- `frontend/src/components/LikeButton.tsx`
- `frontend/src/api/comments.ts`
- `frontend/src/api/likes.ts`

**Files to modify:**
- `frontend/src/components/PostFeed.tsx`

---

### PR 13: Frontend - Create Post Form
**Base:** PR 12
**Purpose:** Allow users to create new posts

**Tasks:**
- Create CreatePostForm component
- Add form validation
- Submit posts to API
- Update feed after successful post creation
- Add styling with Tailwind CSS

**Files to create:**
- `frontend/src/components/CreatePostForm.tsx`

**Files to modify:**
- `frontend/src/components/PostFeed.tsx`

---

### PR 14: Frontend - User Profile & Followers
**Base:** PR 13
**Purpose:** Add user profile view and follower management

**Tasks:**
- Create UserProfile component
- Display user info, posts, followers, following
- Add follow/unfollow functionality
- Add navigation/routing (if needed)
- Add styling with Tailwind CSS

**Files to create:**
- `frontend/src/components/UserProfile.tsx`
- `frontend/src/api/followers.ts`

---

### PR 15: Error Handling & API Improvements
**Base:** PR 14
**Purpose:** Add comprehensive error handling and API improvements

**Tasks:**
- Add error handling middleware to Hono
- Add proper HTTP status codes
- Add input validation error responses
- Add CORS middleware
- Add request logging
- Improve error messages

**Files to modify:**
- `src/server/index.ts`
- Create `src/server/middleware/errorHandler.ts`
- Create `src/server/middleware/cors.ts`

---

### PR 16: Documentation & README
**Base:** PR 15
**Purpose:** Complete project documentation

**Tasks:**
- Update README with setup instructions
- Document API endpoints
- Add development workflow guide
- Add database schema documentation
- Add examples and usage

**Files to modify:**
- `README.md`
- Create `docs/API.md`
- Create `docs/DEVELOPMENT.md`

---

## Summary

**Total PRs:** 16 stacked PRs

**Backend PRs (1-8):** Database setup, migrations, and all API endpoints
**Frontend PRs (9-14):** Frontend setup and all UI components
**Polish PRs (15-16):** Error handling, documentation

Each PR builds logically on the previous one, allowing for incremental development and review.
