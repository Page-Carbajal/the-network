# Development Guide

## Setup

1. **Install Deno**: Follow instructions at [deno.com](https://deno.com/)

2. **Install Node.js**: Required for frontend development

3. **Clone and setup**:
```bash
git clone <repo>
cd the-network
deno task migrate
deno task seed
```

## Development Workflow

### Backend Development

1. Start the server:
```bash
deno task dev
```

2. The server runs on `http://localhost:8000`

3. Make changes to `src/server/index.ts` or other backend files

4. The server will automatically reload (if using a file watcher)

### Frontend Development

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

4. The frontend runs on `http://localhost:3000` (or next available port)

5. Vite will hot-reload on file changes

### Database Migrations

When adding new database tables or modifying schema:

1. Create a new migration file in `src/data/migrations/`:
```
00X_description.sql
```

2. Run migrations:
```bash
deno task migrate
```

3. Migrations are tracked in the `migrations` table

### Adding New API Endpoints

1. Add route handler in `src/server/index.ts`
2. Create query functions in `src/data/queries/`
3. Add Zod schemas in `src/schemas/index.ts` for validation
4. Update API documentation in `docs/API.md`

### Adding New Frontend Components

1. Create component in `frontend/src/components/`
2. Add API client functions in `frontend/src/api/`
3. Import and use in `frontend/src/App.tsx` or other components

## Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Add error handling for all API calls
- Use Zod for input validation
- Keep components focused and reusable

## Testing

Currently, manual testing is recommended:

1. Start backend: `deno task dev`
2. Start frontend: `cd frontend && npm run dev`
3. Test features in the browser
4. Check server logs for errors

## Troubleshooting

### Database Issues

- Ensure migrations are run: `deno task migrate`
- Check database file exists: `src/data/db/social_media.db`
- Delete database file and re-run migrations if needed

### Port Conflicts

- Backend: Change port in `src/server/index.ts`
- Frontend: Vite will automatically use next available port

### CORS Issues

- Check CORS configuration in `src/server/middleware/cors.ts`
- Ensure frontend URL is in allowed origins

## Project Structure

See main README.md for detailed project structure.
