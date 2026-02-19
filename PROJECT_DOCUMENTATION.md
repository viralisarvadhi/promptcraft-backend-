# ⚡ PromptCraft — Complete Project Documentation
### From Business Analysis → Development → QA

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Requirements (BA)](#2-business-requirements-ba)
3. [Tech Stack](#3-tech-stack)
4. [Frontend — Folder Structure](#4-frontend--folder-structure)
5. [Backend — Folder Structure](#5-backend--folder-structure)
6. [Database Schema](#6-database-schema)
7. [API Endpoints](#7-api-endpoints)
8. [AI Evaluation — How It Works](#8-ai-evaluation--how-it-works)
9. [Frontend ↔ Backend Relation](#9-frontend--backend-relation)
10. [Module Breakdown](#10-module-breakdown)
11. [Setup & Run (No Docker)](#11-setup--run-no-docker)
12. [QA — Testing Strategy](#12-qa--testing-strategy)

---

## 1. Project Overview

**PromptCraft** is a web platform where users practice writing high-quality AI prompts.

### What it does in simple words:
- Platform gives user a **task** (e.g., "Write a prompt to build a user dashboard")
- User **writes a prompt** in the text editor
- Platform **evaluates** the prompt using AI (Claude API) or a heuristic engine
- User gets a **score out of 10**, grade (S/A/B/C/D/F), dimension breakdown, and improvement suggestions
- User can **retry** to improve their score
- A **leaderboard** shows top performers globally

---

## 2. Business Requirements (BA)

### 2.1 Functional Requirements

| # | Requirement | Module |
|---|---|---|
| FR-01 | User can register and login | Auth |
| FR-02 | User can browse all challenges | Challenge |
| FR-03 | User can filter challenges by category and difficulty | Challenge |
| FR-04 | User can read a challenge instruction and tips | Challenge |
| FR-05 | User can write a prompt in an editor | Evaluation |
| FR-06 | Platform scores the prompt out of 10 | Evaluation |
| FR-07 | Platform shows score across 5 dimensions | Evaluation |
| FR-08 | Platform gives actionable suggestions to improve | Evaluation |
| FR-09 | User can retry a challenge to beat their best score | Evaluation |
| FR-10 | User can view their attempt history | History |
| FR-11 | User can see global leaderboard | Leaderboard |
| FR-12 | User can see their rank on the leaderboard | Leaderboard |
| FR-13 | Admin can create / update / delete challenges | Admin |
| FR-14 | User profile shows stats (best score, avg score, attempts) | Profile |

### 2.2 Non-Functional Requirements

| # | Requirement | Detail |
|---|---|---|
| NFR-01 | Security | Passwords hashed with bcrypt. JWT auth for protected routes |
| NFR-02 | Rate Limiting | Max 20 evaluation requests per 15 minutes per user |
| NFR-03 | Validation | All inputs validated with Zod on backend |
| NFR-04 | Scalability | Paginated APIs, DB indexes on userId and score |
| NFR-05 | Reliability | AI evaluation falls back to heuristic if Claude API fails |
| NFR-06 | Performance | Sequelize connection pooling, compressed responses |

### 2.3 User Roles

| Role | Permissions |
|---|---|
| Guest (not logged in) | View challenges, view leaderboard |
| User (logged in) | All guest + submit prompts, view history, see rank |
| Admin | All user + create/edit/delete challenges |

---

## 3. Tech Stack

### Frontend
| Layer | Technology | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Component-based UI, strong typing |
| Build Tool | Vite | Fast dev server, HMR, ES modules |
| Styling | Tailwind CSS | Utility-first, no custom CSS needed |
| State Management | Zustand | Lightweight, simpler than Redux for this scale |
| HTTP Client | Axios | Interceptors for auth tokens, error handling |
| Routing | React Router v6 | URL-based navigation |
| Validation | Zod | Shared schema validation |
| Notifications | React Hot Toast | Simple toast notifications |
| Testing | Vitest + RTL | Fast unit tests |

### Backend
| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js 20 | JavaScript on server |
| Framework | Express 4 | Minimal, flexible HTTP framework |
| Language | TypeScript 5 | Type safety across the codebase |
| ORM | Sequelize 6 | Postgres abstraction, migrations, hooks |
| Database | PostgreSQL | Relational, supports arrays (tips, tags) |
| Auth | JWT (access + refresh) | Stateless, scalable authentication |
| Validation | Zod | Schema validation on all request bodies |
| AI | Anthropic Claude API | Evaluates prompt quality with reasoning |
| Logging | Winston | Structured logs with levels |
| Testing | Jest + Supertest | Unit + integration testing |

---

## 4. Frontend — Folder Structure

> Following your defined folder structure pattern

```
promptcraft/                          ← Root
│
├── index.html                        ← Single HTML file (SPA entry point for Vite)
├── package.json                      ← Dependencies and scripts
├── package-lock.json                 ← Exact dependency versions locked
├── vite.config.ts                    ← Vite: dev server port, plugins, path aliases
├── tailwind.config.ts                ← Tailwind: custom fonts, colors, animations
├── postcss.config.js                 ← PostCSS pipeline: runs Tailwind + Autoprefixer
├── tsconfig.json                     ← TypeScript compiler rules for browser code
├── tsconfig.node.json                ← TypeScript compiler rules for Node (vite config)
├── eslint.config.js                  ← Code quality rules
├── .prettierrc                       ← Auto-formatting rules
├── .env                              ← Environment variables (never push to git)
├── .env.example                      ← Template showing what env vars are needed
├── .gitignore                        ← Files excluded from git
├── README.md                         ← Project documentation
│
├── public/                           ← Static assets served as-is by Vite
│   └── assets/
│       └── logo.svg
│
└── src/                              ← All React application code lives here
    │
    ├── main.tsx                      ← TRUE entry point. Mounts React into index.html
    ├── App.tsx                       ← Root component. Renders <AppRoutes />
    ├── App.css                       ← App-level component styles
    ├── index.css                     ← Global stylesheet (Tailwind base import)
    ├── vite-env.d.ts                 ← Tells TypeScript about Vite-specific globals
    │
    ├── routes/
    │   └── AppRoutes.tsx             ← All route definitions (React Router)
    │                                    / → HomePage
    │                                    /challenge/:id → ChallengePage
    │                                    /result/:attemptId → ResultPage
    │                                    /history → HistoryPage
    │                                    /leaderboard → LeaderboardPage
    │                                    /login → LoginPage
    │                                    /register → RegisterPage
    │                                    * → NotFoundPage
    │
    ├── pages/                        ← Full screens mapped to URLs
    │   ├── HomePage.tsx              ← Challenge list + user stats
    │   ├── ChallengePage.tsx         ← Prompt writing interface
    │   ├── ResultPage.tsx            ← Score breakdown + suggestions
    │   ├── HistoryPage.tsx           ← Past attempts log
    │   ├── LeaderboardPage.tsx       ← Global + challenge leaderboard
    │   ├── LoginPage.tsx             ← Login form
    │   ├── RegisterPage.tsx          ← Registration form
    │   └── NotFoundPage.tsx          ← 404 page
    │
    ├── context/
    │   ├── AuthContext.tsx           ← Provides auth state globally (user, token, isLoggedIn)
    │   └── context.ts                ← Barrel file: exports all contexts
    │
    ├── hooks/                        ← Custom React hooks
    │   ├── useAuth.ts                ← Reads from AuthContext (login, logout, user)
    │   ├── useEvaluation.ts          ← Handles prompt submission + loading state
    │   └── useLeaderboard.ts         ← Fetches leaderboard data
    │
    ├── store/                        ← Zustand global state
    │   ├── store.ts                  ← Creates and exports the Zustand store
    │   ├── hooks.ts                  ← Typed store hooks (useAppStore)
    │   └── slices/
    │       ├── challengeSlice.ts     ← Challenge list, selected challenge state
    │       └── evaluationSlice.ts    ← Current prompt, result, isEvaluating
    │
    ├── services/                     ← ALL API calls live here. Pages never call API directly
    │   ├── index.ts                  ← Barrel file: exports all services
    │   ├── auth/
    │   │   └── authService.ts        ← register(), login(), logout(), getMe()
    │   ├── challenge/
    │   │   └── challengeService.ts   ← getAll(), getById(), getStats()
    │   ├── evaluation/
    │   │   └── evaluationService.ts  ← evaluate(), getMyAttempts(), getAttemptById()
    │   ├── leaderboard/
    │   │   └── leaderboardService.ts ← getGlobal(), getByChallenge(), getMyRank()
    │   └── configs/
    │       ├── app.config.ts         ← API base URL, timeouts, app constants
    │       ├── BaseService.ts        ← Axios instance + auth header interceptor
    │       └── ApiService.ts         ← Reusable get/post/put/delete methods
    │
    ├── styles/
    │   └── globals.css               ← Custom global CSS rules (imported once in main.tsx)
    │
    └── utils/
        ├── constants.ts              ← App-wide constants (grades, categories, difficulty)
        └── commonFunctions/
            └── masterCommonFunctions.ts  ← Helper functions: formatDate, getScoreColor,
                                             countWords, getGradeLabel, truncateText
```

---

## 5. Backend — Folder Structure

```
promptcraft-backend/
│
├── package.json                      ← Dependencies and scripts
├── tsconfig.json                     ← TypeScript: compiles src/ → dist/
├── .env                              ← Secrets (DB password, JWT secret, API key)
├── .env.example                      ← Template for env vars
├── .gitignore
├── .sequelizerc                      ← Tells Sequelize CLI where models/migrations/seeders are
├── README.md
│
├── src/
│   │
│   ├── server.ts                     ← Entry point. Starts HTTP server, graceful shutdown
│   ├── app.ts                        ← Express setup: middleware, routes, error handler
│   │
│   ├── config/
│   │   ├── app.ts                    ← Loads .env, validates with Zod, exports config object
│   │   ├── database.ts               ← Creates Sequelize instance, connectDatabase()
│   │   └── sequelize.js              ← Sequelize CLI config (dev/test/prod DB credentials)
│   │
│   ├── models/                       ← Sequelize models = database tables
│   │   ├── index.ts                  ← Imports all models, defines associations (relations)
│   │   ├── User.ts                   ← users table
│   │   ├── Challenge.ts              ← challenges table
│   │   └── Attempt.ts                ← attempts table
│   │
│   ├── controllers/                  ← Receives HTTP request, calls service, sends response
│   │   ├── authController.ts         ← register, login, refresh, logout, me
│   │   ├── challengeController.ts    ← getAll, getById, create, update, delete, getStats
│   │   ├── evaluationController.ts   ← evaluate, getMyAttempts, getAttemptById
│   │   └── leaderboardController.ts  ← getGlobal, getByChallenge, getMyRank
│   │
│   ├── services/                     ← Business logic lives here (not in controllers)
│   │   ├── authService.ts            ← register, login, refreshToken, getProfile
│   │   ├── evaluationService.ts      ← Calls AI or heuristic, saves attempt, updates stats
│   │   ├── challengeService.ts       ← Challenge CRUD + stats aggregation
│   │   └── leaderboardService.ts     ← Leaderboard queries
│   │
│   ├── middleware/
│   │   ├── auth.ts                   ← authenticate() verifies JWT · authorize() checks role
│   │   ├── validate.ts               ← Zod schema middleware (validates req.body)
│   │   └── errorHandler.ts           ← AppError class + global Express error handler
│   │
│   ├── routes/
│   │   └── index.ts                  ← All routers: auth, challenges, evaluate, leaderboard
│   │
│   ├── validators/
│   │   └── index.ts                  ← Zod schemas: RegisterSchema, LoginSchema, EvaluateSchema...
│   │
│   ├── utils/
│   │   ├── evaluator.ts              ← Heuristic scoring engine (no API needed)
│   │   ├── jwt.ts                    ← signAccessToken, verifyAccessToken, signRefreshToken
│   │   ├── logger.ts                 ← Winston logger (info/warn/error/debug)
│   │   └── response.ts               ← sendSuccess(), sendError(), paginate() helpers
│   │
│   └── types/
│       └── index.ts                  ← All TypeScript interfaces (User, Challenge, Attempt...)
│
├── migrations/                       ← Sequelize migration files (version-controlled DB changes)
│
├── seeders/
│   └── 20240101000000-challenges.ts  ← Seeds 6 starter challenges into DB
│
└── tests/
    ├── unit/
    │   └── evaluator.test.ts         ← Tests heuristic scoring logic
    └── integration/
        └── auth.test.ts              ← Tests auth API endpoints end-to-end
```

---

## 6. Database Schema

### Table: `users`

```
┌─────────────────┬───────────────┬──────────────────────────────────────┐
│ Column          │ Type          │ Notes                                │
├─────────────────┼───────────────┼──────────────────────────────────────┤
│ id              │ UUID (PK)     │ Auto-generated unique ID             │
│ username        │ VARCHAR(50)   │ Unique, alphanumeric + underscore    │
│ email           │ VARCHAR(255)  │ Unique, validated email format       │
│ passwordHash    │ VARCHAR       │ bcrypt hashed (12 rounds)            │
│ role            │ ENUM          │ 'user' or 'admin'                    │
│ totalAttempts   │ INTEGER       │ Auto-updated on each evaluation      │
│ bestScore       │ FLOAT         │ Auto-updated on each evaluation      │
│ averageScore    │ FLOAT         │ Auto-updated on each evaluation      │
│ createdAt       │ TIMESTAMP     │ Auto-managed by Sequelize            │
│ updatedAt       │ TIMESTAMP     │ Auto-managed by Sequelize            │
└─────────────────┴───────────────┴──────────────────────────────────────┘
```

### Table: `challenges`

```
┌──────────────────┬───────────────┬──────────────────────────────────────────┐
│ Column           │ Type          │ Notes                                    │
├──────────────────┼───────────────┼──────────────────────────────────────────┤
│ id               │ UUID (PK)     │ Auto-generated                           │
│ title            │ VARCHAR(100)  │ e.g. "User Dashboard"                    │
│ category         │ ENUM          │ UI/UX Design, Backend, AI Prompting,     │
│                  │               │ Database, DevOps, Data Science           │
│ difficulty       │ ENUM          │ Beginner, Intermediate, Advanced         │
│ instruction      │ TEXT          │ Full task description shown to user      │
│ tips             │ ARRAY(STRING) │ Hint list shown to user                  │
│ examplePrompt    │ TEXT          │ A model high-scoring prompt (hidden)     │
│ tags             │ ARRAY(STRING) │ e.g. ["React", "Tailwind", "UI"]        │
│ estimatedMinutes │ INTEGER       │ Estimated time to complete               │
│ isActive         │ BOOLEAN       │ Soft-delete flag (false = hidden)        │
│ createdAt        │ TIMESTAMP     │                                          │
│ updatedAt        │ TIMESTAMP     │                                          │
└──────────────────┴───────────────┴──────────────────────────────────────────┘
```

### Table: `attempts`

```
┌────────────────────┬───────────────┬────────────────────────────────────────────┐
│ Column             │ Type          │ Notes                                      │
├────────────────────┼───────────────┼────────────────────────────────────────────┤
│ id                 │ UUID (PK)     │ Auto-generated                             │
│ userId             │ UUID (FK)     │ → users.id  (CASCADE delete)               │
│ challengeId        │ UUID (FK)     │ → challenges.id  (CASCADE delete)          │
│ promptText         │ TEXT          │ The actual prompt the user typed            │
│ totalScore         │ FLOAT         │ 0–10 (sum of all 5 dimension scores)       │
│ grade              │ ENUM          │ S / A / B / C / D / F                      │
│ clarityScore       │ FLOAT         │ 0–2                                        │
│ specificityScore   │ FLOAT         │ 0–2                                        │
│ contextScore       │ FLOAT         │ 0–2                                        │
│ structureScore     │ FLOAT         │ 0–2                                        │
│ completenessScore  │ FLOAT         │ 0–2                                        │
│ suggestions        │ ARRAY(TEXT)   │ Improvement suggestions list               │
│ strengths          │ ARRAY(TEXT)   │ What the user did well                     │
│ evaluatorType      │ ENUM          │ 'ai' or 'heuristic'                        │
│ wordCount          │ INTEGER       │ Word count of the submitted prompt         │
│ createdAt          │ TIMESTAMP     │                                            │
│ updatedAt          │ TIMESTAMP     │                                            │
└────────────────────┴───────────────┴────────────────────────────────────────────┘

Indexes: userId, challengeId, totalScore, createdAt
```

### Relationships

```
users ──────────────< attempts >──────────────── challenges
  │                                                   │
  │  One user can have many attempts                  │
  │  One challenge can have many attempts             │
  └───────────────────────────────────────────────────┘
```

---

## 7. API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

---

### 🔐 Auth — `/api/v1/auth`

| Method | Endpoint | Auth Required | Request Body | Response |
|---|---|---|---|---|
| POST | `/register` | ❌ | `{ username, email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/login` | ❌ | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/refresh` | ❌ | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| POST | `/logout` | ✅ | — | `{ message }` |
| GET | `/me` | ✅ | — | `{ user }` |

**Register Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Secret123"
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "totalAttempts": 0,
      "bestScore": 0,
      "averageScore": 0
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

### 📋 Challenges — `/api/v1/challenges`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/` | ❌ | Get all challenges (paginated + filterable) |
| GET | `/:id` | ❌ | Get single challenge by ID |
| GET | `/:id/stats` | ❌ | Get attempt stats for a challenge |
| POST | `/` | ✅ Admin only | Create a new challenge |
| PUT | `/:id` | ✅ Admin only | Update a challenge |
| DELETE | `/:id` | ✅ Admin only | Soft-delete a challenge |

**GET `/challenges` Query Params:**
```
?page=1&limit=10&category=Backend&difficulty=Intermediate
```

**GET `/challenges` Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "User Dashboard",
      "category": "UI/UX Design",
      "difficulty": "Beginner",
      "instruction": "Write a prompt to build...",
      "tips": ["Mention layout", "Specify data types"],
      "tags": ["React", "Tailwind"],
      "estimatedMinutes": 10,
      "isActive": true
    }
  ],
  "meta": { "total": 6, "page": 1, "limit": 10, "totalPages": 1 }
}
```

**GET `/challenges/:id/stats` Response:**
```json
{
  "success": true,
  "data": {
    "challengeId": "uuid",
    "totalAttempts": 142,
    "averageScore": 6.4,
    "bestScore": 9.8,
    "gradeDistribution": { "S": 5, "A": 22, "B": 48, "C": 41, "D": 20, "F": 6 }
  }
}
```

---

### 🎯 Evaluation — `/api/v1/evaluate`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/` | ✅ | Submit a prompt for evaluation |
| GET | `/my-attempts` | ✅ | Get your attempt history (paginated) |
| GET | `/my-attempts/:id` | ✅ | Get a specific attempt detail |

**POST `/evaluate` Request:**
```json
{
  "challengeId": "uuid-of-challenge",
  "promptText": "Create a responsive SaaS analytics dashboard in React with Tailwind..."
}
```

**POST `/evaluate` Response:**
```json
{
  "success": true,
  "message": "Evaluation complete",
  "data": {
    "attemptId": "uuid",
    "result": {
      "totalScore": 7.5,
      "maxScore": 10,
      "percentage": 75,
      "grade": "B",
      "dimensionScores": [
        { "key": "clarity",      "label": "Clarity",      "score": 1.8, "maxScore": 2, "feedback": "Clear and unambiguous." },
        { "key": "specificity",  "label": "Specificity",  "score": 1.5, "maxScore": 2, "feedback": "Good technical details." },
        { "key": "context",      "label": "Context",      "score": 1.5, "maxScore": 2, "feedback": "Define user persona more." },
        { "key": "structure",    "label": "Structure",    "score": 1.5, "maxScore": 2, "feedback": "Well organized." },
        { "key": "completeness", "label": "Completeness", "score": 1.2, "maxScore": 2, "feedback": "Missing error handling." }
      ],
      "suggestions": [
        "Add more context about who the dashboard is for",
        "Mention how data should be filtered or refreshed"
      ],
      "strengths": [
        "Great use of specific component names",
        "Tech stack is clearly defined"
      ],
      "evaluatedAt": "2024-01-15T10:30:00Z",
      "evaluatorType": "ai"
    }
  }
}
```

---

### 🏆 Leaderboard — `/api/v1/leaderboard`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/` | ❌ | Global top users by best score |
| GET | `/my-rank` | ✅ | Your rank and total user count |
| GET | `/challenge/:challengeId` | ❌ | Top scores for a specific challenge |

**GET `/leaderboard` Response:**
```json
{
  "success": true,
  "data": [
    { "rank": 1, "userId": "uuid", "username": "alice", "bestScore": 9.8, "totalAttempts": 24, "averageScore": 7.2 },
    { "rank": 2, "userId": "uuid", "username": "bob",   "bestScore": 9.5, "totalAttempts": 18, "averageScore": 8.1 }
  ]
}
```

---

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "[{\"field\":\"email\",\"message\":\"Invalid email address\"}]"
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not enough role) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already exists) |
| 422 | Unprocessable Entity (Zod validation failed) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## 8. AI Evaluation — How It Works

### Overview

When a user submits a prompt, the backend evaluates it using one of two methods:

```
User submits prompt
        ↓
evaluationService.ts checks:
  ENABLE_AI_EVALUATION=true AND ANTHROPIC_API_KEY exists?
        ↓                              ↓
       YES                             NO
        ↓                              ↓
  Claude API call              Heuristic Engine
  (takes ~2-3 sec)             (instant, local)
        ↓                              ↓
   Parse JSON response          Calculate scores
        ↓                              ↓
   Validate with Zod            ─────────────
        ↓
  If Claude fails → fallback to Heuristic
        ↓
  Save Attempt to DB
        ↓
  Update User stats (bestScore, averageScore, totalAttempts)
        ↓
  Return EvaluationResult to frontend
```

---

### The 5 Scoring Dimensions (Rubric)

Every prompt is scored on these 5 dimensions, each worth 0–2 points:

| Dimension | Max | What is being checked |
|---|---|---|
| **Clarity** | 2 | Is the prompt free of vague terms like "etc", "stuff", "things"? Is it specific and unambiguous? |
| **Specificity** | 2 | Does it mention concrete things like colors, layout, tech stack, data types, component names? |
| **Context** | 2 | Does it explain who this is for? What platform? What scale? What user role? |
| **Structure** | 2 | Is it well organized? Does it use numbered steps, sections, or clear formatting? |
| **Completeness** | 2 | Does it cover all the key aspects mentioned in the challenge tips? |

**Total = sum of all 5 → out of 10**

---

### Grade System

| Score | Grade | Label |
|---|---|---|
| 9.0 – 10.0 | S | Outstanding |
| 8.0 – 8.9 | A | Excellent |
| 6.5 – 7.9 | B | Good |
| 5.0 – 6.4 | C | Average |
| 3.0 – 4.9 | D | Needs Work |
| 0.0 – 2.9 | F | Poor |

---

### Claude API — What Prompt We Send

The backend sends this to Claude API (claude-opus-4-6 model):

```
System: You are an expert prompt engineering evaluator. Score prompts on 5 dimensions (0–2 each).
        Respond ONLY with valid JSON — no markdown, no explanation.

User:   Task: [challenge instruction]

        Tips to cover:
        1. [tip 1]
        2. [tip 2]
        ...

        User's Prompt:
        """
        [user's submitted prompt]
        """

        Score each dimension (0–2, decimals OK).
        Return JSON with dimensionScores, suggestions, strengths.
```

### Claude API Response (raw JSON):

```json
{
  "dimensionScores": [
    { "key": "clarity",      "score": 1.8, "feedback": "Clear and direct." },
    { "key": "specificity",  "score": 1.5, "feedback": "Add more component names." },
    { "key": "context",      "score": 1.0, "feedback": "Who is the target user?" },
    { "key": "structure",    "score": 1.5, "feedback": "Good numbered format." },
    { "key": "completeness", "score": 1.2, "feedback": "Missing error handling mention." }
  ],
  "suggestions": ["Define the user persona", "Mention data refresh interval"],
  "strengths": ["Tech stack clearly defined", "Dark theme specified"]
}
```

This response is validated with **Zod** before being used. If Claude fails or returns bad JSON, it automatically falls back to the **Heuristic Engine**.

---

### Heuristic Engine (Fallback / No API)

The heuristic engine scores the prompt locally using keyword matching and word count rules:

```
Clarity:       checks word count + flags vague terms
Specificity:   checks for ~40 technical keywords (react, tailwind, sidebar, chart, etc.)
Context:       checks for persona/platform/scale words
Structure:     checks for colons, numbered lists, line breaks
Completeness:  checks coverage of challenge tips using keyword matching
```

This means **the platform works 100% without any API key** — the heuristic engine still gives useful, meaningful scores.

---

## 9. Frontend ↔ Backend Relation

### How a page talks to the backend

```
Page/Component
    ↓ calls
Custom Hook (useEvaluation, useAuth, etc.)
    ↓ calls
Service (evaluationService.ts)
    ↓ calls
ApiService.ts (Axios wrapper with auth header)
    ↓ HTTP request
Backend API (Express)
    ↓
Route → Middleware (auth, validate) → Controller → Service → Model (Sequelize) → PostgreSQL
    ↓ response
Back to frontend → Hook updates store → Component re-renders
```

### Example: User submits a prompt

```
ChallengePage.tsx
    → calls useEvaluation hook
    → hook calls evaluationService.evaluate(challengeId, promptText)
    → ApiService.post('/evaluate', { challengeId, promptText })
      with Authorization: Bearer <token> header
    → Express route: POST /api/v1/evaluate
    → authenticate middleware verifies JWT
    → validate middleware checks Zod schema
    → evaluationController.evaluate()
    → evaluationService.evaluate()
    → Claude API (or heuristic fallback)
    → Attempt.create() saves to DB
    → User.update() updates stats
    → response: { attemptId, result }
    → frontend stores result in Zustand
    → navigate to ResultPage
```

### Auth Token Flow

```
1. User logs in → backend returns { accessToken, refreshToken }
2. Frontend stores tokens in memory (Zustand) + localStorage
3. Every API request → BaseService.ts adds: Authorization: Bearer <accessToken>
4. If 401 response → BaseService.ts automatically calls /auth/refresh
5. Gets new accessToken → retries original request
6. If refresh fails → user is logged out
```

---

## 10. Module Breakdown

### Module 1: Authentication
- **Pages:** LoginPage, RegisterPage
- **Frontend:** AuthContext, useAuth hook, authService
- **Backend:** authController, authService, User model, JWT utils
- **DB Tables:** users
- **Key Logic:** bcrypt hash on register, JWT sign on login, refresh token rotation

### Module 2: Challenges
- **Pages:** HomePage (challenge list), ChallengePage (prompt editor)
- **Frontend:** challengeService, challengeSlice in store
- **Backend:** challengeController, challengeService, Challenge model
- **DB Tables:** challenges
- **Key Logic:** Paginated list, filter by category/difficulty, admin CRUD

### Module 3: Evaluation
- **Pages:** ChallengePage (submit), ResultPage (show score)
- **Frontend:** useEvaluation hook, evaluationService, evaluationSlice
- **Backend:** evaluationController, evaluationService, Claude API, heuristic engine
- **DB Tables:** attempts
- **Key Logic:** AI or heuristic scoring, save attempt, update user stats

### Module 4: History
- **Pages:** HistoryPage
- **Frontend:** evaluationService.getMyAttempts()
- **Backend:** evaluationController.getMyAttempts()
- **DB Tables:** attempts (filtered by userId)

### Module 5: Leaderboard
- **Pages:** LeaderboardPage
- **Frontend:** useLeaderboard hook, leaderboardService
- **Backend:** leaderboardController, leaderboardService
- **DB Tables:** users (sorted by bestScore), attempts (for challenge-specific)

### Module 6: Admin
- **Access:** Only users with role='admin'
- **Frontend:** Admin-only buttons visible on ChallengeCard
- **Backend:** challengeController (POST/PUT/DELETE) with authorize('admin') middleware
- **DB Tables:** challenges

---

## 11. Setup & Run (No Docker)

### Prerequisites
- Node.js >= 18
- PostgreSQL (already installed on your system ✅)

### Step 1 — Create Database

Open PostgreSQL (psql or pgAdmin) and run:
```sql
CREATE DATABASE promptcraft_db;
CREATE USER promptcraft_user WITH PASSWORD 'promptcraft_pass';
GRANT ALL PRIVILEGES ON DATABASE promptcraft_db TO promptcraft_user;
```

### Step 2 — Setup Backend

```bash
cd promptcraft-backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=promptcraft_db
DB_USER=promptcraft_user
DB_PASSWORD=promptcraft_pass

JWT_SECRET=write_any_long_random_string_here_min_16_chars
JWT_REFRESH_SECRET=write_another_long_random_string_here

# Optional - for AI evaluation
ANTHROPIC_API_KEY=your_key_here
ENABLE_AI_EVALUATION=true

CORS_ORIGIN=http://localhost:3000
```

```bash
npm run db:migrate       # Creates tables in PostgreSQL
npm run db:seed          # Seeds 6 starter challenges
npm run dev              # Starts backend on http://localhost:5000
```

### Step 3 — Setup Frontend

```bash
cd promptcraft
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

```bash
npm run dev              # Starts frontend on http://localhost:3000
```

### Verify Everything Works
```bash
# Backend health check
curl http://localhost:5000/health

# Should return:
{ "status": "ok", "env": "development", "uptime": 5.2 }

# Frontend
open http://localhost:3000
```

---

## 12. QA — Testing Strategy

### Testing Levels

```
Unit Tests         → Test individual functions in isolation
Integration Tests  → Test API endpoints end-to-end
Manual Tests       → Test UI flows in the browser
```

### Backend Unit Tests

File: `tests/unit/evaluator.test.ts`

```
✅ countWords() — returns 0 for empty string
✅ countWords() — counts words correctly
✅ getGrade()   — returns S for score 9+
✅ getGrade()   — returns F for score under 3
✅ heuristicEvaluate() — score between 0 and 10
✅ heuristicEvaluate() — detailed prompt scores higher than vague
✅ heuristicEvaluate() — returns all 5 dimension keys
✅ heuristicEvaluate() — evaluatorType is 'heuristic'
✅ heuristicEvaluate() — returns suggestions array
```

Run:
```bash
cd promptcraft-backend
npm run test
npm run test:coverage
```

### Backend Integration Tests

File: `tests/integration/auth.test.ts`

```
POST /api/v1/auth/register
  ✅ should register a new user
  ✅ should return 409 if email already exists
  ✅ should return 422 if password too short
  ✅ should return 422 if invalid email

POST /api/v1/auth/login
  ✅ should login with valid credentials
  ✅ should return 401 with wrong password
  ✅ should return 401 with non-existent email

GET /api/v1/auth/me
  ✅ should return user profile with valid token
  ✅ should return 401 without token

POST /api/v1/evaluate
  ✅ should evaluate a prompt and return score
  ✅ should return 404 if challengeId invalid
  ✅ should return 401 if not authenticated
  ✅ should return 422 if promptText too short
```

### Frontend Tests

File: `src/__tests__/masterCommonFunctions.test.ts`

```
✅ getScoreColor() — returns green for high score
✅ getScoreColor() — returns red for low score
✅ countWords()    — handles empty string
✅ formatDate()    — formats ISO string correctly
✅ getGradeLabel() — returns correct label for each grade
✅ truncateText()  — truncates and adds ellipsis
```

Run:
```bash
cd promptcraft
npm run test
npm run test:coverage
```

### Manual QA Test Cases

#### Auth Flow
| Test Case | Steps | Expected Result |
|---|---|---|
| Register | Fill form, submit | User created, redirected to home |
| Login | Enter credentials | JWT stored, user shown |
| Invalid login | Wrong password | Error toast shown |
| Token expiry | Wait 7 days or tamper token | Auto-refresh or redirect to login |

#### Challenge Flow
| Test Case | Steps | Expected Result |
|---|---|---|
| Browse challenges | Open home page | 6 challenges shown |
| Filter by category | Select "Backend" | Only Backend challenges shown |
| View challenge | Click a card | Instruction + tips shown |
| Show example | Click "Show Example" | Model prompt revealed |

#### Evaluation Flow
| Test Case | Steps | Expected Result |
|---|---|---|
| Submit short prompt | Type 3 words, submit | Error: "too short" |
| Submit good prompt | Type detailed prompt | Score shown with breakdown |
| Score breakdown | View result | 5 dimension bars animated |
| Retry | Click "Try Again" | Editor cleared, same challenge |
| Beat best score | Submit better prompt | Best score updates |

#### Leaderboard Flow
| Test Case | Steps | Expected Result |
|---|---|---|
| View global | Open leaderboard page | Top users ranked by best score |
| My rank | Logged in user | Rank and total users shown |
| Challenge leaderboard | Click challenge stats | Top scores for that challenge |

### Rate Limit Testing
```bash
# Trigger rate limit on evaluation (>20 requests in 15 min)
for i in {1..25}; do
  curl -X POST http://localhost:5000/api/v1/evaluate \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"challengeId":"uuid","promptText":"test prompt for rate limit"}'
done
# 21st+ request should return 429
```

---

## Summary

```
PromptCraft
│
├── FRONTEND (React + TypeScript + Vite)
│   ├── 8 Pages (Home, Challenge, Result, History, Leaderboard, Login, Register, 404)
│   ├── AuthContext for global auth state
│   ├── Zustand store (challengeSlice, evaluationSlice)
│   ├── Services layer (never call API from pages directly)
│   ├── BaseService + ApiService (Axios with JWT interceptor + auto-refresh)
│   └── Tailwind CSS styling
│
├── BACKEND (Node.js + Express + TypeScript)
│   ├── 15 API endpoints across 4 route groups
│   ├── 3 Sequelize models (User, Challenge, Attempt)
│   ├── JWT Auth (access token 7d + refresh token 30d)
│   ├── Zod validation on all inputs
│   ├── Rate limiting (global + eval-specific)
│   ├── Role-based access control (user / admin)
│   └── Winston logging
│
├── DATABASE (PostgreSQL)
│   ├── users (auth + stats)
│   ├── challenges (tasks seeded with 6 challenges)
│   └── attempts (every evaluation saved with all scores)
│
└── AI EVALUATION
    ├── Claude API (claude-opus-4-6) for intelligent scoring
    ├── 5-dimension rubric (Clarity, Specificity, Context, Structure, Completeness)
    ├── Zod validation of Claude's JSON response
    └── Heuristic fallback (works without any API key)
```
