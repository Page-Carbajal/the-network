# The Network

A full-stack social media platform built with Deno, Hono, React, and SQLite.

## Features

- **User Management**: Create and manage user profiles
- **Posts**: Create, view, and interact with posts
- **Comments**: Comment on posts
- **Likes**: Like and unlike posts
- **Followers**: Follow and unfollow users
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Deno 2**: Runtime environment
- **Hono**: Fast web framework
- **TypeScript**: Type-safe development
- **SQLite**: Lightweight database
- **Faker.js**: Generate realistic mock data
- **Zod**: Schema validation

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

## Project Structure

```
the-network/
├── src/
│   ├── server/
│   │   ├── index.ts              # Main server file
│   │   └── middleware/           # Middleware (CORS, error handling, logging)
│   ├── data/
│   │   ├── db/                   # Database connection and schema
│   │   ├── migrations/          # Database migrations
│   │   ├── queries/              # Database query functions
│   │   └── seed.ts              # Seed script for mock data
│   ├── types/                    # TypeScript type definitions
│   └── schemas/                  # Zod validation schemas
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── api/                  # API client functions
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx             # Entry point
│   └── package.json             # Frontend dependencies
└── deno.json                     # Deno configuration

```

## Getting Started

### Prerequisites

- [Deno](https://deno.com/) (v2.0 or later)
- [Node.js](https://nodejs.org/) (v18 or later) - for frontend

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-network
```

2. Set up the database:
```bash
# Run migrations
deno task migrate

# Seed the database with mock data
deno task seed
```

3. Start the backend server:
```bash
deno task dev
```

The API server will start on `http://localhost:8000`

4. Set up and start the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000` (or the next available port)

## API Endpoints

See [docs/API.md](./docs/API.md) for detailed API documentation.

### Quick Reference

- `GET /users` - Get all users
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `GET /posts/:postId/comments` - Get comments for a post
- `POST /posts/:postId/comments` - Add a comment to a post
- `GET /posts/:postId/likes` - Get likes count for a post
- `POST /posts/:postId/likes` - Toggle like on a post
- `GET /users/:userId/followers` - Get followers of a user
- `GET /users/:userId/following` - Get users that a user is following
- `POST /users/:userId/follow` - Follow a user
- `DELETE /users/:userId/follow` - Unfollow a user

## Development

### Running Migrations

```bash
deno task migrate
```

### Seeding the Database

```bash
deno task seed
```

### Development Scripts

**Backend:**
```bash
deno task dev          # Start development server
deno task migrate      # Run database migrations
deno task seed         # Seed database with mock data
```

**Frontend:**
```bash
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
```

## Database Schema

The database consists of the following tables:

- **users**: User profiles
- **posts**: User posts
- **comments**: Comments on posts
- **likes**: Likes on posts
- **followers**: User follow relationships

See `src/data/db/schema.sql` for the complete schema definition.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
