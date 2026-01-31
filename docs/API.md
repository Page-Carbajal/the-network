# API Documentation

## Base URL

```
http://localhost:8000
```

## Endpoints

### Users

#### Get All Users
```http
GET /users
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "bio": "Software developer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Posts

#### Get All Posts
```http
GET /posts
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "content": "Hello, world!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": { ... },
    "likesCount": 5,
    "commentsCount": 2
  }
]
```

#### Get Post by ID
```http
GET /posts/:id
```

#### Create Post
```http
POST /posts
Content-Type: application/json

{
  "userId": 1,
  "content": "My new post"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "userId": 1,
  "content": "My new post",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Comments

#### Get Comments for a Post
```http
GET /posts/:postId/comments
```

**Response:**
```json
[
  {
    "id": 1,
    "postId": 1,
    "userId": 2,
    "content": "Great post!",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": { ... }
  }
]
```

#### Create Comment
```http
POST /posts/:postId/comments
Content-Type: application/json

{
  "userId": 2,
  "content": "Great post!"
}
```

**Response:** `201 Created`

### Likes

#### Get Likes Count
```http
GET /posts/:postId/likes
```

**Response:**
```json
{
  "postId": 1,
  "likesCount": 5
}
```

#### Toggle Like
```http
POST /posts/:postId/likes
Content-Type: application/json

{
  "userId": 1
}
```

**Response:**
```json
{
  "postId": 1,
  "userId": 1,
  "liked": true,
  "likesCount": 6
}
```

### Followers

#### Get Followers
```http
GET /users/:userId/followers
```

**Response:**
```json
{
  "userId": 1,
  "followers": [ ... ],
  "count": 10
}
```

#### Get Following
```http
GET /users/:userId/following
```

**Response:**
```json
{
  "userId": 1,
  "following": [ ... ],
  "count": 5
}
```

#### Follow User
```http
POST /users/:userId/follow
Content-Type: application/json

{
  "followerId": 2
}
```

**Response:** `201 Created`

#### Unfollow User
```http
DELETE /users/:userId/follow
Content-Type: application/json

{
  "followerId": 2
}
```

**Response:**
```json
{
  "message": "Unfollowed successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `409 Conflict` - Conflict (e.g., already following)
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Error message",
  "details": { ... }  // Optional, for validation errors
}
```
