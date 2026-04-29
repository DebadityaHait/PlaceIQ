import { calculateMatch } from "@/lib/services/matching";
import { cleanSkills } from "@/lib/utils";

type StudentProfile = {
  fullName: string;
  email: string;
  course: string | null;
  graduationYear: number | null;
  skills: string[] | null;
  resumeParsed: unknown;
};

type JobLike = {
  title: string;
  description: string;
  requiredSkills: string[] | null;
  location: string | null;
  jobType: string | null;
};

type ParsedResumeShape = {
  fullTextSummary?: string;
  projects?: Array<{ name?: string; description?: string; technologies?: string[] }>;
  experience?: Array<{ company?: string; role?: string; duration?: string; highlights?: string[] }>;
  education?: Array<{ institution?: string; degree?: string; year?: string }>;
};

function parsedResume(input: unknown): ParsedResumeShape {
  if (!input || typeof input !== "object") return {};
  return input as ParsedResumeShape;
}

export function buildResumeDraft(profile: StudentProfile) {
  const parsed = parsedResume(profile.resumeParsed);
  const skills = cleanSkills(profile.skills || []);
  const summary = parsed.fullTextSummary || `${profile.course || "Student"} candidate with hands-on interest in ${skills.slice(0, 3).join(", ") || "software and problem solving"}.`;
  const education = parsed.education?.length
    ? parsed.education.map((item) => `- ${item.degree || "Degree"}${item.institution ? `, ${item.institution}` : ""}${item.year ? ` (${item.year})` : ""}`)
    : [`- ${profile.course || "Program"}${profile.graduationYear ? `, graduating ${profile.graduationYear}` : ""}`];
  const projects = parsed.projects?.length
    ? parsed.projects.map((project) => `- ${project.name || "Project"}: ${project.description || "Built and documented a practical project."}${project.technologies?.length ? ` Tech: ${project.technologies.join(", ")}.` : ""}`)
    : ["- Placement-ready project: Add a concise project outcome, your role, and the technologies used."];
  const experience = parsed.experience?.length
    ? parsed.experience.map((item) => `- ${item.role || "Role"}${item.company ? `, ${item.company}` : ""}${item.duration ? ` (${item.duration})` : ""}: ${(item.highlights || ["Contributed to practical deliverables."]).join(" ")}`)
    : ["- Add internship, campus, freelance, open-source, or academic team experience here."];

  return [
    profile.fullName,
    profile.email,
    "",
    "SUMMARY",
    summary,
    "",
    "SKILLS",
    skills.join(" | ") || "Add your core technical and soft skills.",
    "",
    "EDUCATION",
    ...education,
    "",
    "PROJECTS",
    ...projects,
    "",
    "EXPERIENCE",
    ...experience
  ].join("\n");
}

export function buildTailoringTips(profile: StudentProfile, job: JobLike) {
  const match = calculateMatch(profile.skills || [], job.requiredSkills || []);
  const matched = match.matchedSkills.slice(0, 4);
  const missing = match.missingSkills.slice(0, 4);
  return {
    score: match.score,
    headline: `${job.title}${job.jobType ? ` (${job.jobType})` : ""}${job.location ? ` · ${job.location}` : ""}`,
    summaryLine: matched.length
      ? `Lead with ${matched.join(", ")} because these skills directly match the role.`
      : "Lead with your strongest relevant project because your profile needs clearer overlap with this role.",
    bullets: [
      matched.length ? `Move ${matched[0]} into the first resume summary line.` : "Add a project bullet that mirrors the most important requirement.",
      missing.length ? `Add a learning or project proof point for ${missing[0]}.` : "Use the matched skills as section keywords, but keep examples specific.",
      `Mirror the job title language: ${job.title}.`,
      "Keep the tailored version to one page and place the best project above generic coursework."
    ],
    missingSkills: missing
  };
}

export function buildSkillImprovementPlan(profile: StudentProfile, jobs: JobLike[]) {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    const match = calculateMatch(profile.skills || [], job.requiredSkills || []);
    for (const skill of match.missingSkills) {
      counts.set(skill, (counts.get(skill) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([skill, demand], index) => ({
      skill,
      demand,
      priority: index < 3 ? "High" : index < 6 ? "Medium" : "Nice-to-have",
      action: `Build one small proof project or add one resume bullet demonstrating ${skill}.`
    }));
}
