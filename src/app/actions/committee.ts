"use server";

import { writeSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";

export type CommitteeState = { error?: string; success?: boolean } | undefined;

export async function addCommitteeMember(
  _prev: CommitteeState,
  formData: FormData,
): Promise<CommitteeState> {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "Login required." };
  }
  if (session.role !== "admin") {
    return { error: "Only admins can add committee members." };
  }

  const chapter = String(formData.get("chapter") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!chapter) return { error: "Pick a chapter." };
  if (!title) return { error: "Enter the title." };
  if (!name) return { error: "Enter the name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };

  const result = await writeSheet("Committee", {
    id: `comm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    chapter,
    title,
    name,
    email,
    created_at: new Date().toISOString(),
  });

  if (!result.ok) {
    return { error: result.error ?? "Failed to add. Try again." };
  }

  return { success: true };
}
