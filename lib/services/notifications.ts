import { db } from "@/db";
import { notifications } from "@/db/schema";

export async function createNotification(input: { userId: string; type: string; title: string; body: string }) {
  try {
    await db.insert(notifications).values(input);
  } catch (error) {
    console.error("Notification failed", error);
  }
}
