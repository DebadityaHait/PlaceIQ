import { describe, expect, it } from "vitest";
import { buildResumeDraft, buildSkillImprovementPlan, buildTailoringTips } from "@/lib/services/career-tools";

const profile = {
  fullName: "John Doe",
  email: "john@example.com",
  course: "B.Tech Computer Science",
  graduationYear: 2027,
  skills: ["Python", "SQL"],
  resumeParsed: {}
};

describe("career tools", () => {
  it("builds a resume draft from profile data", () => {
    expect(buildResumeDraft(profile)).toContain("John Doe");
    expect(buildResumeDraft(profile)).toContain("SKILLS");
  });

  it("tailors suggestions against a job", () => {
    const tips = buildTailoringTips(profile, {
      title: "Python Developer",
      description: "Build services",
      requiredSkills: ["Python", "Django", "SQL"],
      location: "Remote",
      jobType: "Full-time"
    });
    expect(tips.score).toBe(67);
    expect(tips.missingSkills).toEqual(["Django"]);
  });

  it("prioritizes missing skills across jobs", () => {
    const plan = buildSkillImprovementPlan(profile, [
      { title: "ML Intern", description: "", requiredSkills: ["Python", "Pandas"], location: null, jobType: null },
      { title: "Backend", description: "", requiredSkills: ["Python", "Django"], location: null, jobType: null }
    ]);
    expect(plan.map((item) => item.skill)).toEqual(["Django", "Pandas"]);
  });
});
