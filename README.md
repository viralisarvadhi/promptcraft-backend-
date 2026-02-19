# PromptCraft Backend

Backend API for PromptCraft - AI prompt evaluation platform.

## Tech Stack

- Node.js 20 + Express 4 + TypeScript
- PostgreSQL (local installation)
- Sequelize ORM v6 with migrations
- JWT authentication
- Google Gemini API for AI evaluation
- Winston logging

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database credentials (PostgreSQL)
- JWT secrets (minimum 16 characters)
- Gemini API key (optional, from https://aistudio.google.com)

### 3. Setup Database

Make sure PostgreSQL is running, then create the database:

```sql
CREATE DATABASE promptcraft_db;
CREATE USER promptcraft_user WITH PASSWORD 'promptcraft_pass';
GRANT ALL PRIVILEGES ON DATABASE promptcraft_db TO promptcraft_user;
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Data

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Server will start on http://localhost:5000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run pending migrations
- `npm run db:migrate:undo` - Rollback last migration
- `npm run db:seed` - Run seeders
- `npm run db:reset` - Reset database (undo all + migrate + seed)

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Challenges
- `GET /api/v1/challenges` - List challenges (with filters)
- `GET /api/v1/challenges/:id` - Get challenge details
- `GET /api/v1/challenges/:id/stats` - Get challenge statistics
- `POST /api/v1/challenges` - Create challenge (admin only)
- `PUT /api/v1/challenges/:id` - Update challenge (admin only)
- `DELETE /api/v1/challenges/:id` - Delete challenge (admin only)

### Evaluation
- `POST /api/v1/evaluate` - Submit prompt for evaluation (rate limited)
- `GET /api/v1/evaluate/my-attempts` - Get user's attempts
- `GET /api/v1/evaluate/my-attempts/:id` - Get single attempt

### Leaderboard
- `GET /api/v1/leaderboard` - Global leaderboard
- `GET /api/v1/leaderboard/my-rank` - User's rank
- `GET /api/v1/leaderboard/challenge/:challengeId` - Challenge leaderboard

## Project Structure

```
src/
├── config/          # Configuration (env, database)
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── validators/      # Zod schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point

migrations/          # Database migrations
seeders/             # Database seeders
tests/               # Unit and integration tests
```

## Key Features

- ✅ Soft delete on all models (paranoid: true)
- ✅ JWT authentication with refresh tokens
- ✅ Role-based authorization
- ✅ Request validation with Zod
- ✅ Rate limiting (20 evaluations per 15 minutes)
- ✅ Gemini API integration with heuristic fallback
- ✅ Comprehensive error handling
- ✅ Winston logging
- ✅ Database migrations (no sync())

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
