# PlaceIQ MVP QA Checklist

## Student Registration and Profile

- Register a student account with name, email, password, and course.
- Confirm the student is redirected to login after registration.
- Sign in and open `/student/profile`.
- Update DOB, course, graduation year, and skills.
- Upload a PDF resume smaller than 5 MB.
- Confirm invalid file types and oversized files are rejected.
- Confirm Gemini parsing populates parsed resume data when configured.
- Confirm manual skills entry remains usable when Gemini is missing or parsing fails.
- Confirm profile-created and resume notifications are visible.

## Officer Verification

- Sign in as `officer@example.com`.
- Open `/officer/pending-profiles`.
- Verify a pending student profile.
- Confirm status changes to `verified` and eligibility becomes enabled.
- Reject a pending profile with a reason.
- Confirm rejection requires a reason and creates a notification.

## Recruiter Job Posting

- Sign in as `recruiter@example.com`.
- Open `/recruiter/jobs/new`.
- Create a job with title, description, required skills, location, type, range, deadline, and published status.
- Confirm the job appears in `/recruiter/jobs`.
- Confirm the job appears immediately in `/student/jobs`.

## Student Jobs and Matching

- Sign in as `student@example.com`.
- Open `/student/jobs` and confirm published jobs are listed.
- Confirm unverified students cannot apply.
- Open `/student/matches`.
- Confirm jobs are ranked by match score descending.
- Confirm matched and missing skills are displayed.

## Application Lifecycle

- Apply to a job as a verified eligible student.
- Confirm duplicate applications are blocked.
- Confirm the application appears in `/student/applications`.
- Sign in as the recruiter and open the job applications page.
- Update the candidate status to `shortlisted`, `rejected`, and `selected`.
- Confirm the student receives in-app notifications.
- Confirm missing Resend configuration does not block status updates.

## Security and Authorization

- Confirm student routes reject recruiter/officer sessions.
- Confirm recruiter routes reject student/officer sessions.
- Confirm officer routes reject student/recruiter sessions.
- Confirm recruiters cannot open jobs they do not own.
- Confirm students cannot change verification status.

## Build and Deployment

- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run test`.
- Run `npm run build`.
- Deploy to Vercel with required env vars.
- Confirm production login and seeded demo flows work.
