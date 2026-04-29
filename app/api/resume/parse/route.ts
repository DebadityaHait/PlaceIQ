import { NextResponse } from "next/server";
import { parseResume } from "@/lib/services/resume-parser";
import { requireUser } from "@/lib/session";
import { MAX_RESUME_BYTES } from "@/lib/validators/resume";

export async function POST(request: Request) {
  await requireUser("student");
  const formData = await request.formData();
  const file = formData.get("resume");
  if (!(file instanceof File)) return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
  if (file.type !== "application/pdf") return NextResponse.json({ error: "Resume must be a PDF" }, { status: 400 });
  if (file.size > MAX_RESUME_BYTES) return NextResponse.json({ error: "Resume must be 5 MB or smaller" }, { status: 400 });
  const parsed = await parseResume(Buffer.from(await file.arrayBuffer()), file.type);
  return NextResponse.json(parsed);
}
