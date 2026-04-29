import { cleanSkills } from "@/lib/utils";
import { parseResumeWithGemini } from "./gemini";
import type { ParsedResume } from "@/lib/validators/resume";

export async function parseResume(bytes: Buffer, mimeType: string): Promise<{ ok: true; parsed: ParsedResume; skills: string[] } | { ok: false; reason: string }> {
  try {
    const parsed = await parseResumeWithGemini(bytes, mimeType);
    return { ok: true, parsed, skills: cleanSkills(parsed.skills) };
  } catch (error) {
    console.error("Resume parsing failed", error);
    return { ok: false, reason: "AI parsing failed" };
  }
}
