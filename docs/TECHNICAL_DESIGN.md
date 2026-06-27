# Technical Design: CPNS Productivity Web App (MVP)

## 1. Architecture
-   **Frontend:** Next.js app (React) for SSR/SSG & client-side interactivity.
-   **Backend:** Node.js (Express) as API Gateway (if needed later) or direct Supabase calls from frontend.
-   **Database:** PostgreSQL managed by Supabase.
-   **Authentication:** NextAuth.js with Supabase for user management.
-   **Deployment:** Vercel for frontend.

## 2. Data Model (Supabase/PostgreSQL)

### 2.1 `users` table
-   `id` (UUID, PK)
-   `email` (TEXT, UNIQUE)
-   `password_hash` (TEXT, for email/pass auth)
-   `created_at` (TIMESTAMP)
-   `last_login` (TIMESTAMP)

### 2.2 `tasks` table
-   `id` (UUID, PK)
-   `user_id` (UUID, FK -> users.id)
-   `content` (TEXT)
-   `status` (ENUM: 'pending', 'completed')
-   `priority` (INT, 1-5)
-   `created_at` (TIMESTAMP)
-   `completed_at` (TIMESTAMP, NULLABLE)

### 2.3 `pomodoro_sessions` table
-   `id` (UUID, PK)
-   `user_id` (UUID, FK -> users.id)
-   `duration_minutes` (INT)
-   `type` (ENUM: 'work', 'short_break', 'long_break')
-   `started_at` (TIMESTAMP)
-   `ended_at` (TIMESTAMP)

## 3. API Endpoints (Frontend to Supabase RPC/REST)

### 3.1 Auth (via NextAuth.js)
-   `/api/auth/signin`
-   `/api/auth/signout`
-   `/api/auth/callback/google`

### 3.2 Tasks
-   `GET /api/tasks` → get user's tasks
-   `POST /api/tasks` → create new task
-   `PUT /api/tasks/:id` → update task (content, status, priority)
-   `DELETE /api/tasks/:id` → delete task

### 3.3 Pomodoro
-   `POST /api/pomodoro` → record a completed Pomodoro session

## 4. Frontend Components
-   Auth forms (Login, Register)
-   Dashboard (Pomodoro timer, Task list)
-   Task Item component
-   Progress display

## 5. Security Considerations
-   Row Level Security (RLS) on Supabase tables.
-   Input validation on all API calls.
-   Password hashing (handled by NextAuth.js).
-   CSRF protection (handled by NextAuth.js).

## 6. Deployment
-   Frontend: Vercel (CI/CD from Git).
-   Database: Supabase.
