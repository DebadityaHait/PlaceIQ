import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["student", "recruiter", "officer"]);
export const verificationStatus = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const applicationStatus = pgEnum("application_status", ["applied", "shortlisted", "rejected", "selected"]);
export const jobStatus = pgEnum("job_status", ["draft", "published", "closed"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  role: userRole("role").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  dob: date("dob"),
  course: text("course"),
  graduationYear: integer("graduation_year"),
  skills: text("skills").array().default([]),
  resumeFileName: text("resume_file_name"),
  resumeMimeType: text("resume_mime_type"),
  resumeSizeBytes: integer("resume_size_bytes"),
  resumeData: text("resume_data"),
  resumeText: text("resume_text"),
  resumeParsed: jsonb("resume_parsed").default({}),
  verificationStatus: verificationStatus("verification_status").default("pending"),
  isJobEligible: boolean("is_job_eligible").default(false),
  rejectionReason: text("rejection_reason"),
  companyName: text("company_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  recruiterId: uuid("recruiter_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredSkills: text("required_skills").array().notNull().default([]),
  location: text("location"),
  jobType: text("job_type"),
  salaryRange: text("salary_range"),
  deadline: date("deadline").notNull(),
  status: jobStatus("status").default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    status: applicationStatus("status").default("applied"),
    matchScore: integer("match_score").default(0),
    matchedSkills: text("matched_skills").array().default([]),
    missingSkills: text("missing_skills").array().default([]),
    coverNote: text("cover_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
  },
  (table) => [unique("applications_job_student_unique").on(table.jobId, table.studentId)]
);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export type UserRole = (typeof userRole.enumValues)[number];
export type ApplicationStatus = (typeof applicationStatus.enumValues)[number];
export type VerificationStatus = (typeof verificationStatus.enumValues)[number];
