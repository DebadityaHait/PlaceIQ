import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.uuid(),
  coverNote: z.string().trim().max(1000).optional()
});

export const applicationStatusSchema = z.object({
  applicationId: z.uuid(),
  status: z.enum(["applied", "shortlisted", "rejected", "selected"])
});
