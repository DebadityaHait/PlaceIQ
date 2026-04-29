import { describe, expect, it } from "vitest";
import { calculateMatch, normalizeSkills } from "@/lib/services/matching";

describe("matching", () => {
  it("normalizes and removes duplicate skills", () => {
    expect(normalizeSkills([" Python ", "python", "", "SQL"])).toEqual(["Python", "SQL"]);
  });

  it("calculates a deterministic percentage score", () => {
    expect(calculateMatch(["Python", "SQL"], ["Python", "Django", "SQL"])).toEqual({
      score: 67,
      matchedSkills: ["Python", "SQL"],
      missingSkills: ["Django"]
    });
  });

  it("handles zero required skills", () => {
    expect(calculateMatch(["Python"], [])).toEqual({ score: 0, matchedSkills: [], missingSkills: [] });
  });
});
