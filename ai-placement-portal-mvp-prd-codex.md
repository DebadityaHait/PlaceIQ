# PRD: AI-Enabled University Placement & Recruitment Portal MVP

**Version:** 1.0  
**Target Builder:** OpenAI Codex  
**Target Deployment:** Vercel  
**Primary Database:** Neon Postgres  
**AI Provider:** Google Gemini API  
**Preferred Gemini Model:** `gemini-3.1-flash-lite-preview`  
**Project Type:** Full-stack MVP web application

---

## 1. Executive Summary

Build a deployable MVP for an **AI-Enabled University Placement & Recruitment Portal**.

The product replaces a manual, fragmented university placement workflow with a centralized full-stack platform for:

- Students creating placement profiles, uploading resumes, receiving AI-assisted job matches, and applying for jobs.
- Recruiters posting jobs, reviewing matched candidates, and updating candidate statuses.
- Placement officers verifying student profiles and overseeing placement readiness.

The MVP must be production-ready enough to deploy on Vercel and demonstrate the core recruitment lifecycle end-to-end.

---

## 2. Codex Mission

You are Codex. Build the full MVP described in this PRD.

Do not stop at scaffolding. Implement the app, database schema, core flows, UI, validation, tests, seed data, and deployment readiness.

At completion, provide:

1. A summary of implemented features.
2. Setup instructions.
3. Environment variables required.
4. Database migration/seed instructions.
5. Vercel deployment instructions.
6. The live Vercel deployment URL if deployment credentials are available.
7. Known limitations and future improvements.

---

## 3. Product Problem

University placement workflows are often manual and fragmented. Placement teams coordinate student profiles, resumes, recruiter requirements, application statuses, and student eligibility across disconnected tools. This causes:

- Missed opportunities for students.
- Slow recruiter response cycles.
- Placement officer workload overhead.
- Poor visibility into student readiness and application progress.
- Inconsistent candidate matching.

---

## 4. Product Solution

Create a centralized placement and recruitment portal with:

- Role-based access for students, recruiters, and placement officers.
- Student profile and resume upload.
- AI-assisted resume parsing using Gemini.
- Deterministic skill-based job matching.
- Recruiter job posting.
- Student application tracking.
- Placement officer verification.
- Candidate status lifecycle management.
- In-app notifications.
- Optional email notifications.
- Vercel deployment.

---

## 5. MVP Goals

### Primary Goals

- Build a complete end-to-end working MVP.
- Use Neon Postgres as the database.
- Use Neon MCP if available for database setup, migrations, inspection, and seeding.
- Use Gemini Flash-Lite for AI resume parsing and structured extraction.
- Deploy or prepare deployment to Vercel.
- Keep authorization, eligibility, and final match scoring deterministic in app code.

### Success Criteria

The MVP is successful when:

- Students can register, create profiles, upload resumes, and apply to jobs after officer verification.
- Recruiters can register, post jobs, view applicants, and update candidate statuses.
- Placement officers can verify or reject student profiles.
- Resume parsing works with Gemini or falls back gracefully.
- AI-matched jobs are ranked by match score.
- Notifications are created for key lifecycle events.
- The project builds successfully and is Vercel-ready.

---

## 6. Core Users and Stakeholders

### Product Owner

Defines the product vision, manages priorities, and validates that the working software delivers business value.

### Scrum Master

Supports Agile delivery, removes impediments, and ensures sprint progress.

### Development Team

Builds the database, AI integration, full-stack app, tests, and deployment pipeline.

### End Users

#### Students

Applicants who create profiles, upload resumes, browse jobs, receive AI-assisted matches, apply for jobs, and track statuses.

#### Recruiters

Hiring teams who post jobs, review candidates, see match scores, and shortlist or select students.

#### Placement Officers

University admin users who review and verify student data, manage eligibility, and oversee placement operations.

---

## 7. Scope

## 7.1 In Scope

### Authentication and Roles

Implement credentials-based authentication with three roles:

- `student`
- `recruiter`
- `officer`

Requirements:

- Register with email and password.
- Hash passwords securely with bcrypt.
- Store users in Neon Postgres.
- Use secure sessions.
- Redirect users to role-specific dashboards.
- Protect routes with middleware.

### Student Features

Students can:

- Register and log in.
- Create and edit a placement profile.
- Add:
  - Full name
  - Email
  - Date of birth
  - Course/program
  - Graduation year
  - Skills
  - Resume PDF
- Upload a resume PDF.
- Trigger Gemini resume parsing.
- Review and confirm parsed skills.
- View verification status:
  - `pending`
  - `verified`
  - `rejected`
- View all published jobs.
- View AI-matched jobs ranked by deterministic match score.
- Apply to jobs only after officer verification.
- Track application statuses:
  - `applied`
  - `shortlisted`
  - `rejected`
  - `selected`
- View in-app notifications.

### Recruiter Features

Recruiters can:

- Register and log in.
- Create company/recruiter profile.
- Post jobs with:
  - Job title
  - Description
  - Required skills
  - Location
  - Job type
  - Salary/stipend range
  - Application deadline
- View their posted jobs.
- View applicants for their jobs.
- View candidate profile details.
- View deterministic candidate match score.
- Update candidate status.
- Trigger in-app notifications when candidate status changes.
- Trigger email notification if email env vars are configured.

### Placement Officer Features

Placement officers can:

- Log in.
- View pending student profiles.
- Review student information and parsed resume details.
- Mark a student profile as verified.
- Reject a profile with a reason.
- Enable or disable job application eligibility.
- View student profiles and jobs.

### AI Features

Use Gemini for:

- Resume parsing.
- Structured skill extraction.
- Education extraction.
- Experience extraction.
- Project extraction.
- Optional concise candidate summary generation.

Do **not** use Gemini for:

- Authentication.
- Authorization.
- Profile verification decisions.
- Final job match score.
- Direct database writes without validation.
- Any action that changes eligibility without human/user action.

### Matching Features

Use deterministic local logic for matching:

- Normalize student skills.
- Normalize job required skills.
- Calculate intersection.
- Calculate missing skills.
- Score based on percentage of required skills matched.
- Sort by match score descending.

### Notifications

Implement in-app notifications for:

- Student profile created.
- Resume parsed successfully.
- Resume parsing failed.
- Profile verified.
- Profile rejected.
- Application submitted.
- Candidate shortlisted.
- Candidate rejected.
- Candidate selected.

### Deployment

Target deployment:

- Vercel for frontend and server routes.
- Neon for database.
- Environment variables configured in Vercel.
- Optional Vercel CLI deployment if authenticated.

---

## 7.2 Out of Scope for MVP

Do not implement unless core MVP is complete:

- Real ML success prediction model.
- Complex LLM-based ranking.
- Interview scheduling.
- Calendar integration.
- Recruiter payments.
- Multi-university tenancy.
- Advanced analytics.
- Bulk resume upload.
- Chat/messaging.
- ATS integrations.
- OAuth login.
- Production-grade email template editor.
- Admin role-permission editor.
- Mobile app.

---

## 8. Recommended Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon Postgres
- Neon MCP for development-time database operations if available
- Drizzle ORM
- Auth.js / NextAuth-compatible credentials auth
- bcryptjs
- Zod
- React Hook Form
- Google Gemini API via `@google/genai`
- Resend for optional email notifications
- Vitest for core utility tests
- Vercel for deployment

Preferred project setup:

```bash
npx create-next-app@latest placement-portal --typescript --tailwind --eslint --app
cd placement-portal
```

Install packages:

```bash
npm install drizzle-orm @neondatabase/serverless
npm install next-auth bcryptjs
npm install @google/genai
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react date-fns clsx tailwind-merge
npm install resend
npm install -D drizzle-kit vitest @testing-library/react @testing-library/jest-dom
```

If shadcn/ui is used:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea label badge table dialog dropdown-menu tabs progress alert form
```

---

## 9. Environment Variables

Create `.env.example`:

```bash
# Database
DATABASE_URL=
DIRECT_DATABASE_URL=

# Auth
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite-preview

# Optional email notifications
RESEND_API_KEY=
EMAIL_FROM=

# Optional Vercel Blob alternative if used for resume file storage
BLOB_READ_WRITE_TOKEN=
```

Rules:

- Never expose private keys to the client.
- Do not prefix private env vars with `NEXT_PUBLIC_`.
- Do not log secrets.
- Do not commit `.env.local`.
- If deploying to Vercel, add all required env vars in Vercel Project Settings.
- If Gemini key is not provided, resume upload must still work with manual skills fallback.

---

## 10. Neon MCP Requirements

Codex may use Neon MCP if available.

Use Neon MCP to:

- Create or select a Neon project.
- Create a development branch.
- Inspect schema.
- Apply migrations.
- Run seed data.
- Validate SQL queries.
- Create safe migration branches.

Important rules:

- Neon MCP is for development-time database management.
- Do not embed MCP credentials into app runtime.
- Do not expose admin/database management actions in the deployed app.
- Before destructive migrations, display the SQL and require confirmation.
- Prefer additive migrations for MVP.
- Use migrations committed to the repository so deployment is reproducible.

---

## 11. Database Design

Use Neon Postgres.

Use Drizzle ORM schema and SQL migrations.

Enable the `pgcrypto` extension for `gen_random_uuid()`.

### 11.1 Extensions

```sql
create extension if not exists pgcrypto;
```

### 11.2 Enums

```sql
create type user_role as enum ('student', 'recruiter', 'officer');
create type verification_status as enum ('pending', 'verified', 'rejected');
create type application_status as enum ('applied', 'shortlisted', 'rejected', 'selected');
create type job_status as enum ('draft', 'published', 'closed');
```

### 11.3 Users

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role user_role not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 11.4 Profiles

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  email text not null,
  dob date,
  course text,
  graduation_year int,
  skills text[] default '{}',

  resume_file_name text,
  resume_mime_type text,
  resume_size_bytes int,
  resume_data bytea,
  resume_text text,
  resume_parsed jsonb default '{}'::jsonb,

  verification_status verification_status default 'pending',
  is_job_eligible boolean default false,
  rejection_reason text,

  company_name text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Resume storage note:

- For MVP simplicity, storing PDF bytes in Neon is acceptable with a strict max file size.
- File size limit: 5 MB.
- If Codex chooses Vercel Blob instead, replace `resume_data bytea` with `resume_url text`, use `BLOB_READ_WRITE_TOKEN`, and update the README.

### 11.5 Jobs

```sql
create table jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_skills text[] not null default '{}',
  location text,
  job_type text,
  salary_range text,
  deadline date not null,
  status job_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 11.6 Applications

```sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status application_status default 'applied',
  match_score int default 0,
  matched_skills text[] default '{}',
  missing_skills text[] default '{}',
  cover_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, student_id)
);
```

### 11.7 Notifications

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
```

### 11.8 Indexes

```sql
create index idx_profiles_user_id on profiles(user_id);
create index idx_profiles_role on profiles(role);
create index idx_profiles_verification_status on profiles(verification_status);
create index idx_jobs_recruiter_id on jobs(recruiter_id);
create index idx_jobs_status on jobs(status);
create index idx_applications_job_id on applications(job_id);
create index idx_applications_student_id on applications(student_id);
create index idx_notifications_user_id on notifications(user_id);
```

### 11.9 Updated Timestamp Trigger

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

create trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create trigger jobs_set_updated_at
before update on jobs
for each row execute function set_updated_at();

create trigger applications_set_updated_at
before update on applications
for each row execute function set_updated_at();
```

---

## 12. Authorization Rules

Because this MVP uses app-level auth instead of database RLS, enforce authorization in server actions, route handlers, and database queries.

### Global Rules

- Never trust client-submitted role or user ID.
- Always get current user from session server-side.
- All mutations must validate:
  - User is authenticated.
  - User has the correct role.
  - User owns the resource or is authorized to act on it.

### Student Rules

Students can:

- Read and update their own profile.
- Read published jobs.
- Read their own applications.
- Create applications only if:
  - Their profile belongs to them.
  - `verification_status = 'verified'`.
  - `is_job_eligible = true`.
  - They have not already applied to the job.

### Recruiter Rules

Recruiters can:

- Read and update their own recruiter profile.
- Create jobs linked to their own profile.
- Update only their own jobs.
- Read applications only for their own jobs.
- Update application statuses only for applications to their own jobs.

### Officer Rules

Placement officers can:

- Read all student profiles.
- Verify or reject student profiles.
- Read all jobs.
- Read all applications.
- Must not edit student skills or resumes directly in MVP.

### Notification Rules

Users can:

- Read their own notifications.
- Mark their own notifications as read.

Server-side code can:

- Create notifications for lifecycle events.

---

## 13. Routes and Pages

## 13.1 Public Routes

### `/`

Landing page with:

- Project title.
- Short explanation.
- CTA buttons:
  - Student Login
  - Recruiter Login
  - Officer Login
  - Register

### `/login`

Login form:

- Email
- Password
- Submit

After login:

- Student -> `/student/dashboard`
- Recruiter -> `/recruiter/dashboard`
- Officer -> `/officer/dashboard`

### `/register`

Registration form:

- Full name
- Email
- Password
- Role selector:
  - Student
  - Recruiter
  - Placement Officer
- Course/program field visible for student
- Company name field visible for recruiter

For MVP, officer self-registration can be allowed but label it clearly as demo behavior. In README, note that production should restrict officer creation.

---

## 13.2 Student Routes

### `/student/dashboard`

Show:

- Verification status.
- Profile completion.
- Number of applications.
- Latest notifications.
- CTA to complete profile or view matches.

### `/student/profile`

Show form for:

- Full name
- DOB
- Course
- Graduation year
- Skills
- Resume upload
- Parsed resume preview
- Submit/update profile

### `/student/jobs`

Show all published jobs:

- Title
- Recruiter/company
- Location
- Required skills
- Deadline
- Apply button

If student is not verified:

- Disable Apply button.
- Show message: “Your profile must be verified by a placement officer before you can apply.”

### `/student/matches`

Show matched jobs ranked by match score:

- Job title
- Required skills
- Matched skills
- Missing skills
- Match score
- Apply button

### `/student/applications`

Show application table:

- Job title
- Company
- Application date
- Status
- Match score

### `/student/notifications`

Show notifications list and mark-as-read action.

---

## 13.3 Recruiter Routes

### `/recruiter/dashboard`

Show:

- Total posted jobs.
- Total applications.
- Shortlisted candidates.
- Recent applications.

### `/recruiter/jobs`

List recruiter’s jobs.

### `/recruiter/jobs/new`

Create job form:

- Title
- Description
- Required skills
- Location
- Job type
- Salary range
- Deadline
- Status

### `/recruiter/jobs/[id]`

Job detail page with edit option.

### `/recruiter/jobs/[id]/applications`

Show applicants:

- Student name
- Course
- Skills
- Resume parsed summary
- Match score
- Application status
- Status update dropdown

---

## 13.4 Officer Routes

### `/officer/dashboard`

Show:

- Pending profiles count.
- Verified students count.
- Rejected students count.
- Published jobs count.

### `/officer/pending-profiles`

Show pending student profiles:

- Student name
- Email
- Course
- Skills
- Resume parsed summary
- Approve button
- Reject button with reason

### `/officer/students`

Show all student profiles with status filters.

### `/officer/jobs`

Read-only list of jobs.

---

## 14. Data Validation

Use Zod schemas for:

- Registration
- Login
- Student profile
- Resume upload
- Job creation/update
- Application creation
- Application status update
- Profile verification/rejection

Validation rules:

### Registration

- Email must be valid.
- Password minimum length: 8.
- Role must be one of `student`, `recruiter`, `officer`.
- Full name required.

### Resume Upload

- PDF only.
- Max size: 5 MB.
- Gracefully reject invalid files.

### Job Posting

- Title required.
- Description required.
- At least one required skill.
- Deadline must be in the future.
- Status must be valid enum.

### Application

- Job must exist.
- Student must be verified and eligible.
- Duplicate application blocked.

---

## 15. Gemini Integration

Use Gemini API for resume parsing.

### 15.1 Model

Default:

```bash
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

Allow override via env var.

### 15.2 Package

```bash
npm install @google/genai
```

### 15.3 Service Files

Create:

```txt
lib/services/gemini.ts
lib/services/resume-parser.ts
```

### 15.4 Gemini Service Responsibilities

`lib/services/gemini.ts` should:

- Initialize Gemini client server-side only.
- Read `GEMINI_API_KEY`.
- Read `GEMINI_MODEL`.
- Expose a safe function to parse PDF bytes.
- Return typed output.
- Throw safe internal errors without exposing secrets.

### 15.5 Resume Parser Output

Expected parsed JSON:

```json
{
  "fullTextSummary": "string",
  "skills": ["Python", "Machine Learning", "SQL"],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "highlights": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ]
}
```

### 15.6 Zod Schema for Gemini Output

Create a Zod schema and validate Gemini output before storing.

If validation fails:

- Store the resume.
- Store a failure notification.
- Let user manually enter skills.

### 15.7 Gemini System Instruction

Use this instruction:

```txt
You are an information extraction engine for a university placement portal.
Extract structured data from a student resume.
Return only valid JSON that matches the requested schema.
Do not invent details.
If a field is missing, return an empty string or an empty array.
Normalize skill names to common labels such as Python, React, SQL, Machine Learning, Java, C++, Next.js, PostgreSQL.
```

### 15.8 Gemini User Prompt

```txt
Parse this resume PDF and return structured JSON with:
- fullTextSummary
- skills
- education
- experience
- projects
```

### 15.9 Failure Handling

If `GEMINI_API_KEY` is missing:

- Resume upload should still succeed.
- Store file metadata and PDF bytes.
- Show: “Resume uploaded. AI parsing is not configured, so please enter your skills manually.”

If Gemini request fails:

- Resume upload should still succeed.
- Show: “Resume uploaded, but AI parsing failed. Please add or review your skills manually.”
- Create notification:
  - Title: “Resume uploaded”
  - Body: “AI parsing failed, but your resume was saved.”

---

## 16. Resume Upload Flow

When a student uploads a resume:

1. Authenticate student.
2. Validate file is PDF.
3. Validate file size <= 5 MB.
4. Read PDF bytes server-side.
5. Save resume metadata and bytes in Neon.
6. If Gemini is configured, send PDF to Gemini for extraction.
7. Validate structured output.
8. Save `resume_parsed` JSON.
9. Merge extracted skills into a proposed skill list.
10. Let student confirm or edit skills.
11. Create notification.

Important:

- Do not block profile creation if parsing fails.
- Do not let Gemini output directly overwrite skills without user review.
- Do not expose raw Gemini errors to the user.

---

## 17. Deterministic Matching Logic

Create:

```ts
type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
};

export function calculateMatch(
  studentSkills: string[],
  jobSkills: string[]
): MatchResult;
```

Rules:

- Lowercase for comparison.
- Trim whitespace.
- Remove duplicates.
- Ignore empty strings.
- Preserve clean display names where possible.
- If job has zero required skills:
  - score = 0
  - matchedSkills = []
  - missingSkills = []
- Otherwise:

```ts
score = Math.round((matchedSkills.length / requiredJobSkills.length) * 100)
```

Sort matching jobs by:

1. `matchScore DESC`
2. `created_at DESC`

Gemini may extract skills, but final scoring must be deterministic and testable.

---

## 18. Application Lifecycle

Application statuses:

- `applied`
- `shortlisted`
- `rejected`
- `selected`

### Student Applies

When a verified student applies:

1. Validate eligibility.
2. Calculate match score against job.
3. Insert application.
4. Create student notification.
5. Application appears on recruiter dashboard.

### Recruiter Updates Status

When recruiter updates status:

1. Validate recruiter owns the job.
2. Update application status.
3. Create student notification.
4. Send optional email if configured.
5. Do not fail update if email is unavailable.

---

## 19. Notification Service

Create:

```ts
export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
}): Promise<void>;
```

Rules:

- Notifications are stored in database.
- User can view their own notifications.
- User can mark as read.
- Notifications should be created for key lifecycle events.
- Notification failures should be logged, but should not break core flows unless database is unavailable.

---

## 20. Optional Email Service

Use Resend if env vars are present.

Create:

```ts
export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean }>;
```

Rules:

- If `RESEND_API_KEY` or `EMAIL_FROM` is missing:
  - return `{ ok: true, skipped: true }`
  - log server-side warning
- If email fails:
  - do not fail the main workflow
  - log error
- Do not expose email provider errors to end users.

Email events:

- Profile verified.
- Profile rejected.
- Candidate shortlisted.
- Candidate selected.
- Candidate rejected.

---

## 21. Caching and Freshness

Important test requirement:

- When a recruiter posts a job, the job must appear immediately to students.

Implementation guidance:

- Avoid stale static caching for authenticated dashboards.
- Use dynamic rendering for dashboard/job pages.
- After job creation, refresh/revalidate relevant paths if needed.
- Do not rely on stale client cache for job listings.

Recommended:

```ts
export const dynamic = "force-dynamic";
```

for authenticated dashboard/list pages if needed.

---

## 22. UI and UX Requirements

Use clean, modern dashboard UI.

### General UI

- Responsive layout.
- Sidebar or top nav depending on screen size.
- Role-specific navigation.
- Dashboard cards.
- Tables for lists.
- Badges for statuses.
- Progress indicators for match score.
- Toasts for success and errors.
- Loading states.
- Empty states.
- Confirm dialogs for important actions.

### Student UX

If not verified:

- Show verification status prominently.
- Disable Apply.
- Show: “Your profile must be verified by a placement officer before you can apply.”

If resume parsing fails:

- Show non-blocking warning.
- Highlight manual skills input.

### Recruiter UX

For applications:

- Show match score.
- Show matched and missing skills.
- Make status update easy.

### Officer UX

For pending profiles:

- Show enough information to approve/reject quickly.
- Include parsed resume summary.
- Require rejection reason when rejecting.

---

## 23. Functional Test Cases

Implement as a manual QA checklist in `QA_CHECKLIST.md`. Add automated unit tests where practical.

### TC-S1-01: Student Profile Creation

Precondition:

- Student registration page is accessible.

Steps:

1. Navigate to registration.
2. Enter name, email, DOB, course.
3. Upload a PDF resume.
4. Submit.

Expected:

- Profile is created.
- Resume is stored.
- Confirmation notification is created.
- Email confirmation is sent only if email env vars are configured.
- Missing email configuration must not fail the flow.

### TC-S1-02: Recruiter Job Posting

Precondition:

- Recruiter is logged in.

Steps:

1. Navigate to Post Job.
2. Enter job title, description, required skills.
3. Set deadline.
4. Submit.

Expected:

- Job post is published.
- Job is immediately visible to students.
- No cache delay.

### TC-S1-03: Data Verification

Precondition:

- Student profile exists with `pending` status.

Steps:

1. Log in as placement officer.
2. Open pending profiles.
3. Review profile.
4. Click “Mark as Verified.”

Expected:

- Profile status becomes `verified`.
- `is_job_eligible` becomes `true`.
- Student can apply for jobs.

### TC-S2-01: AI Job Matching

Precondition:

- Verified student has skills such as Python and Machine Learning.
- Recruiter has posted jobs with matching skills.

Steps:

1. Log in as student.
2. Navigate to AI Job Match.
3. Load matching jobs.

Expected:

- Matching jobs display.
- Results are ranked by `match_score DESC`.
- Matched and missing skills are shown.

### TC-S2-02: Resume Parsing

Precondition:

- Student is logged in.
- Gemini API key is configured.

Steps:

1. Upload a PDF resume.
2. Parse resume.

Expected:

- Skills, education, experience, and projects are extracted where possible.
- Parsed output is saved.
- Student can confirm or edit extracted skills.

Fallback expected:

- If Gemini is missing or fails, resume still uploads and manual skill entry remains available.

### TC-S2-03: Recruitment Lifecycle

Precondition:

- Candidate has applied for a job.
- Recruiter is logged in.

Steps:

1. Open applications for a job.
2. Select candidate.
3. Change status to `shortlisted`.

Expected:

- Candidate status updates to `shortlisted`.
- Student receives in-app notification.
- Email notification is sent if configured.
- Missing email configuration does not fail status update.

---

## 24. Seed Data

Create seed script:

```bash
npm run db:seed
```

Seed demo users:

| Email | Password | Role |
|---|---:|---|
| student@example.com | Password123! | student |
| recruiter@example.com | Password123! | recruiter |
| officer@example.com | Password123! | officer |

Seed profiles:

- Student:
  - Full name: John Doe
  - Course: B.Tech Computer Science
  - Skills: Python, Machine Learning, SQL
  - Verification status: verified
  - Is job eligible: true

- Recruiter:
  - Full name: Jane Recruiter
  - Company: Acme Tech

- Officer:
  - Full name: Pat Officer

Seed jobs:

1. Python Developer
   - Required skills: Python, Django, SQL
2. Machine Learning Intern
   - Required skills: Python, Machine Learning, Pandas
3. Frontend Developer
   - Required skills: React, TypeScript, Tailwind
4. Full Stack Developer
   - Required skills: Next.js, PostgreSQL, Node.js

---

## 25. Required Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx db/seed.ts"
  }
}
```

If the latest Next.js version does not support `next lint`, configure ESLint directly and update the script.

---

## 26. Suggested File Structure

```txt
placement-portal/
  app/
    page.tsx
    login/
      page.tsx
    register/
      page.tsx
    student/
      dashboard/
        page.tsx
      profile/
        page.tsx
      jobs/
        page.tsx
      matches/
        page.tsx
      applications/
        page.tsx
      notifications/
        page.tsx
    recruiter/
      dashboard/
        page.tsx
      jobs/
        page.tsx
      jobs/new/
        page.tsx
      jobs/[id]/
        page.tsx
      jobs/[id]/applications/
        page.tsx
    officer/
      dashboard/
        page.tsx
      pending-profiles/
        page.tsx
      students/
        page.tsx
      jobs/
        page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts
      resume/
        parse/
          route.ts
  components/
    ui/
    dashboard/
    forms/
    jobs/
    profiles/
    notifications/
  db/
    index.ts
    schema.ts
    migrations/
    seed.ts
  lib/
    auth.ts
    session.ts
    services/
      email.ts
      gemini.ts
      matching.ts
      notifications.ts
      resume-parser.ts
    validators/
      application.ts
      auth.ts
      job.ts
      profile.ts
      resume.ts
    utils.ts
  tests/
    matching.test.ts
    validators.test.ts
  middleware.ts
  drizzle.config.ts
  .env.example
  README.md
  QA_CHECKLIST.md
```

---

## 27. Implementation Plan

Build in this order:

1. Create Next.js app.
2. Configure Tailwind and shadcn/ui.
3. Configure Neon database connection.
4. Configure Drizzle schema and migrations.
5. Use Neon MCP if available to create/apply database migrations.
6. Build auth with credentials and role-based sessions.
7. Add route protection middleware.
8. Build public landing, login, and registration.
9. Build student profile creation and editing.
10. Add resume upload and storage.
11. Add Gemini resume parsing.
12. Add manual skills fallback.
13. Build officer profile verification.
14. Build recruiter job creation.
15. Build student job listings.
16. Build deterministic matching service.
17. Build student match page.
18. Build application creation.
19. Build recruiter application review and status updates.
20. Build notifications.
21. Add optional email notifications.
22. Add seed data.
23. Add tests.
24. Add README and QA checklist.
25. Run lint, typecheck, test, and build.
26. Deploy to Vercel if credentials are available.

---

## 28. README Requirements

The README must include:

1. Project overview.
2. Tech stack.
3. Local setup.
4. Environment variables.
5. Neon setup.
6. Neon MCP usage notes.
7. Drizzle migration commands.
8. Seed data instructions.
9. Gemini setup.
10. Vercel deployment instructions.
11. Demo accounts.
12. Known limitations.

Include these commands:

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Build checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Vercel deployment:

```bash
vercel
vercel --prod
```

If Vercel CLI is not authenticated, explain dashboard deployment:

1. Push repo to GitHub.
2. Import repo into Vercel.
3. Add env vars.
4. Deploy.
5. Redeploy after changing env vars.

---

## 29. Deployment Requirements

The app must be deployable to Vercel.

### Vercel Environment Variables

Add:

```bash
DATABASE_URL
DIRECT_DATABASE_URL
AUTH_SECRET
NEXTAUTH_URL
GEMINI_API_KEY
GEMINI_MODEL
RESEND_API_KEY
EMAIL_FROM
BLOB_READ_WRITE_TOKEN
```

Required for core MVP:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`

Required for AI parsing:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Optional:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `BLOB_READ_WRITE_TOKEN`

### Production Rules

- Set `NEXTAUTH_URL` to deployed Vercel URL.
- Ensure database migrations are applied before testing production.
- Redeploy after changing env vars.
- Do not expose secrets in logs or UI.

---

## 30. Security Requirements

- Passwords must be hashed with bcrypt.
- Never store plaintext passwords.
- Never expose secrets to the client.
- Validate all inputs with Zod.
- Sanitize display of user-provided text.
- Authorize all server-side mutations.
- Prevent duplicate applications.
- Prevent students from applying before verification.
- Prevent recruiters from accessing jobs/applications they do not own.
- Prevent students from changing their own verification status.
- Prevent client-side role spoofing.
- Keep Gemini output untrusted until validated.

---

## 31. Testing Requirements

### Unit Tests

Add tests for:

- `calculateMatch`
- skill normalization
- duplicate skill handling
- zero required skills
- Zod validators
- Gemini output schema validation

### Manual QA

Create `QA_CHECKLIST.md` covering:

- Student registration
- Student profile creation
- Resume upload
- Gemini parsing success
- Gemini parsing failure
- Officer verification
- Recruiter job posting
- Student job visibility
- Student match ranking
- Application submission
- Recruiter status update
- Notifications
- Optional email fallback
- Vercel build

---

## 32. Acceptance Criteria

The MVP is accepted when:

- App runs locally with `npm run dev`.
- App builds successfully with `npm run build`.
- Database migrations run against Neon.
- Seed data works.
- Student, recruiter, and officer demo accounts work.
- Student profile and resume upload work.
- Gemini parsing works when key is configured.
- Manual fallback works when Gemini is unavailable.
- Officer can verify students.
- Recruiter can post jobs.
- Student can view jobs.
- Verified student can apply.
- Unverified student cannot apply.
- Matching page ranks jobs by match score descending.
- Recruiter can update candidate status.
- Student receives notifications.
- Optional email does not break workflows.
- README explains all setup and deployment steps.
- Project is ready for Vercel deployment.
- Deployment URL is provided if Codex has deployment access.

---

## 33. Known MVP Limitations to Document

Codex must include these in README:

- Officer self-registration is for demo only and should be restricted in production.
- Resume parsing depends on Gemini API availability.
- Final matching is skill-overlap based, not a trained ML model.
- Resume PDF storage in Neon is acceptable for MVP only; production should use object storage.
- Email notifications require Resend configuration.
- No interview scheduling yet.
- No analytics dashboard yet.
- No multi-university tenant isolation yet.

---

## 34. Final Instruction to Codex

Build the complete MVP.

Use Neon Postgres for database. Use Neon MCP if available to create branches, apply migrations, inspect schema, and seed data. Use Gemini with `gemini-3.1-flash-lite-preview` for resume parsing and structured extraction. Keep authorization, eligibility, and final match scoring deterministic and server-side. Prepare the app for Vercel deployment and deploy if credentials are available.

Do not expose API keys, database URLs, session secrets, or MCP credentials. Do not rely on Gemini for security-sensitive decisions. Do not leave the app as a mock-only scaffold.
