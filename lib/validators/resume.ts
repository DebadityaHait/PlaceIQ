import { z } from "zod";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const parsedResumeSchema = z.object({
  fullTextSummary: z.string().default(""),
  skills: z.array(z.string()).default([]),
  education: z.array(z.object({
    institution: z.string().default(""),
    degree: z.string().default(""),
    year: z.string().default("")
  })).default([]),
  experience: z.array(z.object({
    company: z.string().default(""),
    role: z.string().default(""),
    duration: z.string().default(""),
    highlights: z.array(z.string()).default([])
  })).default([]),
  projects: z.array(z.object({
    name: z.string().default(""),
    description: z.string().default(""),
    technologies: z.array(z.string()).default([])
  })).default([])
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;
