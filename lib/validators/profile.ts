import { z } from "zod";

export const studentProfileSchema = z.object({
  fullName: z.string().trim().min(2),
  dob: z.string().optional(),
  course: z.string().trim().min(2),
  graduationYear: z.coerce.number().int().min(2000).max(2100),
  skills: z.array(z.string()).default([])
});

export const verificationSchema = z.object({
  profileId: z.uuid(),
  action: z.enum(["verified", "rejected"]),
  rejectionReason: z.string().trim().optional()
}).superRefine((data, ctx) => {
  if (data.action === "rejected" && !data.rejectionReason) {
    ctx.addIssue({ code: "custom", message: "Rejection reason is required", path: ["rejectionReason"] });
  }
});
