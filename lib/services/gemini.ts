import { GoogleGenAI } from "@google/genai";
import { parsedResumeSchema, type ParsedResume } from "@/lib/validators/resume";

const SYSTEM_INSTRUCTION = `You are an information extraction engine for a university placement portal.
Extract structured data from a student resume.
Return only valid JSON that matches the requested schema.
Do not invent details.
If a field is missing, return an empty string or an empty array.
Normalize skill names to common labels such as Python, React, SQL, Machine Learning, Java, C++, Next.js, PostgreSQL.`;

export async function parseResumeWithGemini(bytes: Buffer, mimeType: string): Promise<ParsedResume> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { text: `${SYSTEM_INSTRUCTION}\n\nParse this resume PDF and return structured JSON with fullTextSummary, skills, education, experience, and projects.` },
          { inlineData: { mimeType, data: bytes.toString("base64") } }
        ]
      }
    ],
    config: { responseMimeType: "application/json" }
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return parsedResumeSchema.parse(JSON.parse(text));
}
