# PlaceIQ

AI-enabled university placement and recruitment portal MVP for students, recruiters, and placement officers.

## Tech Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Auth.js/NextAuth credentials auth with bcrypt password hashing
- Neon Postgres with Drizzle ORM
- Google Gemini via `@google/genai` for resume parsing
- Resend optional email notifications
- Vitest for utility and validator tests

## Features

- Student, recruiter, and placement officer registration/login
- Role-protected dashboards and navigation
- Student placement profile, PDF resume upload, Gemini parsing, manual skills fallback
- Officer profile verification/rejection and eligibility control
- Recruiter job posting and applicant review
- Student job browsing, deterministic match ranking, applications, and status tracking
- In-app notifications for profile, resume, application, and status events
- Optional email notifications when Resend env vars are configured

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required:

```bash
DATABASE_URL=
DIRECT_DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Required for AI parsing:

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

Optional:

```bash
RESEND_API_KEY=
EMAIL_FROM=
BLOB_READ_WRITE_TOKEN=
```

Never commit `.env.local`. Private keys are only used server-side.

## Neon Setup

Create a Neon Postgres project, copy the pooled connection string into `DATABASE_URL`, and use the same value for `DIRECT_DATABASE_URL` for the MVP. The current migration creates the enums, tables, indexes, and timestamp triggers required by the PRD.

Neon MCP was used during development to create the `PlaceIQ` project and validate the database workflow. MCP credentials are not part of the runtime app.

## Database Commands

```bash
npm run db:migrate
npm run db:seed
```

Seeded demo accounts:

| Email | Password | Role |
|---|---|---|
| student@example.com | Password123! | student |
| recruiter@example.com | Password123! | recruiter |
| officer@example.com | Password123! | officer |

## Gemini Setup

Set `GEMINI_API_KEY` and optionally override `GEMINI_MODEL`. If Gemini is not configured or parsing fails, resume upload still succeeds and students can manually edit skills.

## Build Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Vercel Deployment

```bash
vercel
vercel --prod
```

For dashboard deployment:

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add all required env vars in Project Settings.
4. Set `NEXTAUTH_URL` to the deployed URL.
5. Deploy or redeploy after changing env vars.

## Known Limitations

- Officer self-registration is for demo only and should be restricted in production.
- Resume parsing depends on Gemini API availability.
- Final matching is skill-overlap based, not a trained ML model.
- Resume PDF storage in Neon is acceptable for MVP only; production should use object storage.
- Email notifications require Resend configuration.
- No interview scheduling yet.
- No analytics dashboard yet.
- No multi-university tenant isolation yet.
