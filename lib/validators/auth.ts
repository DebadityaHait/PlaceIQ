import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.email().toLowerCase(),
  password: z.string().min(8),
  role: z.enum(["student", "recruiter", "officer"]),
  course: z.string().trim().optional(),
  companyName: z.string().trim().optional()
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1)
});
