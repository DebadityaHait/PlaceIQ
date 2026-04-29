import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  requiredSkills: z.array(z.string()).min(1),
  location: z.string().trim().optional(),
  jobType: z.string().trim().optional(),
  salaryRange: z.string().trim().optional(),
  deadline: z.string().refine((value) => new Date(value) > new Date(), "Deadline must be in the future"),
  status: z.enum(["draft", "published", "closed"]).default("published")
});
