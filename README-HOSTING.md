# Detlof Preparatory School portal — source and hosting bundle

This archive contains the React/Vite frontend supplied in the original ZIP, updates to the JHS subject list and requested mark structure, plus a Node/Express API and PostgreSQL schema to start the backend work.

## Important deployment status

**This is a deployable development scaffold, not yet a production-ready school information system.** The current React screens still use browser `localStorage` for their demo data. They do not yet call the new API for sign-in, result publishing, timetable data, or parent notifications. Do not enter real learner information or expose the demo portal as a live production service until the frontend is connected to the API and security checks are completed.

The production build no longer accepts the hard-coded demo admin code. The API provides separate JWT authentication and role checks, but the frontend sign-in flow still needs to be connected to it. This is intentionally called out rather than presenting a demo-only PIN as secure authentication.

## Included

- `src/` — responsive React website, student portal, admin portal, landing page and school data.
- `src/utils/grades.ts` — requested assessment formula and validation.
- `server/` — Express API, PostgreSQL schema migration, JWT role middleware, validation, audit log and result workflow.
- `Dockerfile`, `docker-compose.yml`, `deploy/nginx.conf` — container-based web/API/database setup.
- `server/tests/grades.test.js` — automated checks for result calculation and mark limits.
- `.env.example` — server environment-variable template. Create your own root `.env` for Docker; never commit secrets.

## Result calculation

- SBA 1: 0–10
- SBA 2: 0–20
- Project work: 0–20
- Examination: 0–100, scaled to a contribution out of 50

`Final score = SBA1 + SBA2 + Project work + (Examination / 2)`

Example: 8 + 16 + 18 + (76 / 2) = 80/100.

The API accepts a batch of result rows as JSON at `POST /api/results/drafts`. It validates all maximums and stores the rows as **draft**. An authorised academic admin must approve the batch with `POST /api/results/:batchId/approve`, then publish it with `POST /api/results/:batchId/publish`. Only published results are returned by the student result endpoint.

## Run locally (Docker)

Requirements: Docker Engine/Desktop with Docker Compose.

1. Copy `.env.example` to `.env` at the project root and set strong unique values:

   - `POSTGRES_PASSWORD`: long random database password.
   - `JWT_SECRET`: at least 32 random characters.
   - `WEB_PORT`: optionally change the web port (default 8080).
   - `FRONTEND_ORIGIN`: the exact public origin used by your browser.

2. Start the services:

   ```sh
   docker compose up --build -d
   ```

3. Open `http://localhost:8080`. Check API health at `http://localhost:8080/api/health`.

4. Create the first admin account from the API container. Use a unique password of at least 12 characters:

   ```sh
   docker compose exec api node src/create-admin.js admin@your-real-domain.example 'replace-with-a-unique-long-password'
   ```

   The API admin account is not yet connected to the React admin login screen. Do not assume creating this account secures the demo screen.

5. View service logs:

   ```sh
   docker compose logs -f api web
   ```

## API routes included

- `GET /api/health` — health check.
- `POST /api/auth/login` — email/password login; returns a short-lived JWT.
- `GET /api/me` — current account.
- `GET /api/students`, `POST /api/students` — authorised student roster access/create.
- `POST /api/import/results` — validate `.xlsx`/`.csv` results and stage a draft batch (required headers: Student ID, Subject, Term, Academic Year, SBA 1, SBA 2, Project Work, Examination).
- `POST /api/results/drafts` — validate and stage a JSON result batch.
- `GET /api/results?status=draft|approved|published` — admin result listing.
- `POST /api/results/:batchId/approve` — approve drafts.
- `POST /api/results/:batchId/publish` — publish approved rows.
- `GET /api/results/mine` — only the logged-in student's published results.
- `GET /api/timetable/mine` — timetable for a linked student account.
- `GET /api/audit` — admin audit log.

## Before real school use

The following must be completed and tested against the actual school's data and policies:

1. Connect every frontend data operation to the API; remove the demo `localStorage` store and demo student logins from production builds.
2. Implement secure account provisioning and password reset; link each student and parent user to verified records. Do not use student IDs or dates of birth as passwords.
3. Add admin screens for Excel `.xlsx` and CSV upload, timetable imports, preview/validation, duplicate detection, batch review, approval, publishing and audit history. The API accepts validated `.xlsx`/`.csv` uploads at `POST /api/import/results` (multipart form field `file`) and JSON result batches at `POST /api/results/drafts`; the browser screens are not yet wired to these endpoints.
4. Implement and test SMS/WhatsApp provider adapters. The current API does **not** send messages; provider credentials and a verified sender/template configuration are required. Add delivery receipts, retry logic, opt-out handling where applicable and a reviewable notification log.
5. Add API routes for timetable/announcement/bill publication, backups, database restore testing, monitoring, HTTPS, domain configuration and production secret management.
6. Have the school approve the grading policy, grade bands, report-card format, subject options, and term/year structure. NaCCA's JHS Common Core Programme learning areas are documented at https://nacca.gov.gh/common-core-programme-ccp/; confirm language options and current school requirements with the academic leadership.
7. Run accessibility, responsive-device, privacy, security and acceptance tests. Configure HTTPS and restrict database/network access before exposing the system publicly.

## Security notes

The API uses Helmet, rate limiting on login, bcrypt password hashes, JWT expiry, parameterised PostgreSQL queries, input validation, role checks and audit records. These controls are not a substitute for a security review, HTTPS, secure hosting, backup/restore drills, or testing the completed frontend-to-API integration. Follow Express's production security guidance: https://expressjs.com/en/advanced/best-practice-security/.

Never upload a real `.env`, API key, password list or real student records to a public repository.
