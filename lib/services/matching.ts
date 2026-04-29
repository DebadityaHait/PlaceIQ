import { cleanSkills } from "@/lib/utils";

export type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
};

export function normalizeSkills(skills: string[]) {
  return cleanSkills(skills);
}

export function calculateMatch(studentSkills: string[], jobSkills: string[]): MatchResult {
  const normalizedStudent = normalizeSkills(studentSkills);
  const normalizedJob = normalizeSkills(jobSkills);
  if (normalizedJob.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  const studentMap = new Map(normalizedStudent.map((skill) => [skill.toLowerCase(), skill]));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const jobSkill of normalizedJob) {
    const match = studentMap.get(jobSkill.toLowerCase());
    if (match) matchedSkills.push(jobSkill);
    else missingSkills.push(jobSkill);
  }

  return {
    score: Math.round((matchedSkills.length / normalizedJob.length) * 100),
    matchedSkills,
    missingSkills
  };
}
