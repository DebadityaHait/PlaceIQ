import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSkillList(value: FormDataEntryValue | null | string[] | undefined): string[] {
  if (Array.isArray(value)) return cleanSkills(value);
  return cleanSkills(String(value || "").split(","));
}

export function cleanSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of skills) {
    const skill = raw.trim().replace(/\s+/g, " ");
    const key = skill.toLowerCase();
    if (!skill || seen.has(key)) continue;
    seen.add(key);
    output.push(skill);
  }
  return output;
}

export function redirectForRole(role: string) {
  if (role === "student") return "/student/dashboard";
  if (role === "recruiter") return "/recruiter/dashboard";
  return "/officer/dashboard";
}

export function formatDate(input: Date | string | null | undefined) {
  if (!input) return "Not set";
  return new Date(input).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}
