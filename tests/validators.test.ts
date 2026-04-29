import { describe, expect, it } from "vitest";
import { jobSchema } from "@/lib/validators/job";
import { parsedResumeSchema } from "@/lib/validators/resume";

describe("validators", () => {
  it("rejects past job deadlines", () => {
    expect(jobSchema.safeParse({
      title: "Developer",
      description: "A valid job description",
      requiredSkills: ["Python"],
      deadline: "2000-01-01",
      status: "published"
    }).success).toBe(false);
  });

  it("validates Gemini parsed resume output", () => {
    expect(parsedResumeSchema.safeParse({
      fullTextSummary: "Candidate with Python experience",
      skills: ["Python"],
      education: [],
      experience: [],
      projects: []
    }).success).toBe(true);
  });
});
