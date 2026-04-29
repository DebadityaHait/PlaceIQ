import { Resend } from "resend";

export async function sendEmail(input: { to: string; subject: string; html: string }): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn("Email skipped: RESEND_API_KEY or EMAIL_FROM is not configured");
    return { ok: true, skipped: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: process.env.EMAIL_FROM, ...input });
    return { ok: true };
  } catch (error) {
    console.error("Email failed", error);
    return { ok: false };
  }
}
