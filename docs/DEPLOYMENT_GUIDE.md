# Deployment Guide: CPNS Productivity Web App (MVP)

## 1. Prerequisites
-   GitHub account.
-   Vercel account (linked to GitHub).
-   Supabase account.
-   Node.js (LTS), npm/yarn installed locally.
-   Git installed.

## 2. Supabase Setup
1.  **Create Project:** Go to Supabase dashboard -> "New project".
2.  **Database Configuration:**
    -   Schema: Create `users`, `tasks`, `pomodoro_sessions` tables as per `TECHNICAL_DESIGN.md`.
    -   Enable Row Level Security (RLS) for all tables.
    -   Define RLS policies:
        -   `users`: Select for all, Insert for anonymous, Update/Delete for `auth.uid()`.
        -   `tasks`: Select/Insert/Update/Delete where `user_id = auth.uid()`.
        -   `pomodoro_sessions`: Select/Insert where `user_id = auth.uid()`.
3.  **API Keys:** Note down `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings -> API.
4.  **Auth Providers:** Enable Google OAuth in Supabase Auth settings. Add redirect URL `https://<YOUR_VERCEL_DOMAIN>/api/auth/callback/google`.

## 3. Local Setup & Development
1.  **Clone Repo:** `git clone <YOUR_REPO_URL>`
2.  **Install Dependencies:** `cd cpns-app && npm install`
3.  **Environment Variables:** Create a `.env.local` file:
    ```
    NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=<ANY_32_CHAR_SECRET> # Generate with `openssl rand -base64 32`
    GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
    GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
    ```
4.  **Run Dev Server:** `npm run dev` (app accessible at `http://localhost:3000`)

## 4. Vercel Deployment (Frontend)
1.  **Create Project:** Go to Vercel dashboard -> "Add New..." -> "Project".
2.  **Import Git Repository:** Select your GitHub repo.
3.  **Configure Project:**
    -   Framework Preset: Next.js.
    -   Build & Output Settings: Default.
4.  **Environment Variables:** Add the following to Vercel Project Settings -> Environment Variables:
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `NEXTAUTH_URL` (set to your Vercel domain, e.g., `https://cpns-app.vercel.app`)
    -   `NEXTAUTH_SECRET`
    -   `GOOGLE_CLIENT_ID`
    -   `GOOGLE_CLIENT_SECRET`
5.  **Deploy:** Vercel will automatically build and deploy from your `main` branch pushes.
6.  **Update Supabase Redirect:** After first deploy, copy Vercel domain and update Google OAuth redirect URL in Supabase Auth settings.

## 5. Post-Deployment Checks
-   Access the deployed URL.
-   Register/Login (Email/Google) works.
-   Pomodoro timer functions.
-   Tasks can be added/edited/completed/deleted.
-   Progress display updates.
