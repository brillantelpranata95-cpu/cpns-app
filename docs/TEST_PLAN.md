# Test Plan: CPNS Productivity Web App (MVP)

## 1. Goal
Ensure all core features function correctly and meet requirements.

## 2. Test Phases
-   **Unit Testing:** Individual functions/components.
-   **Integration Testing:** Interaction between components/services (FE-BE, FE-DB).
-   **End-to-End Testing (E2E):** Full user flows.
-   **User Acceptance Testing (UAT):** Real users validate.

## 3. Test Cases (Examples)

### 3.1 User Authentication
-   **TC-AUTH-001:** User can register with valid email/password.
    -   *Steps:* Visit /register, input valid data, submit.
    -   *Expected:* Account created, redirected to dashboard, logged in.
-   **TC-AUTH-002:** User cannot register with existing email.
-   **TC-AUTH-003:** User can log in with valid credentials.
-   **TC-AUTH-004:** User cannot log in with invalid credentials.
-   **TC-AUTH-005:** User can log in via Google OAuth.

### 3.2 Pomodoro Timer
-   **TC-POMO-001:** Timer starts, counts down, notifies on completion.
    -   *Steps:* Click 'Start', wait for 25 mins (or reduced for test), verify notification.
    -   *Expected:* Timer counts down, browser notification appears.
-   **TC-POMO-002:** Timer can be paused and resumed.
-   **TC-POMO-003:** Timer can be reset.
-   **TC-POMO-004:** Completed session is recorded in progress.

### 3.3 Task Management
-   **TC-TASK-001:** User can add a new task.
-   **TC-TASK-002:** User can edit an existing task.
-   **TC-TASK-003:** User can mark a task as completed.
-   **TC-TASK-004:** Completed task count updates.
-   **TC-TASK-005:** User can delete a task.

### 3.4 Basic Progress Tracking
-   **TC-PROG-001:** Completed task count updates correctly after task completion.
-   **TC-PROG-002:** Total Pomodoro sessions count updates after session completion.

## 4. Tools
-   **Unit/Integration:** Jest / React Testing Library.
-   **E2E:** Playwright / Cypress.
-   **Manual Testing:** Browser.

## 5. Test Data
-   Pre-populate Supabase with test users and tasks.

## 6. Bug Reporting
-   Use GitHub Issues with clear steps to reproduce, expected vs actual behavior, screenshots.

## 7. Performance Testing (Basic)
-   Manual checks for slow page loads on different network conditions.

## 8. Security Testing (Basic)
-   Manual checks for common vulnerabilities (XSS, SQLi via input forms).
