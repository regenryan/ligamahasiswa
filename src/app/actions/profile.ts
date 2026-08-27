"use server";

import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

export type ProfileState = {
  ok: boolean;
  error?: string;
};

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Login required" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const chapter = String(formData.get("chapter") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || name.length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." };
  }

  if (!chapter) {
    return { ok: false, error: "Select a chapter." };
  }

  const allowedChapters = ["ligamy", "ligaum", "ligautm", "ligausm", "ligaunisza", "sparcutem"];
  if (!allowedChapters.includes(chapter)) {
    return { ok: false, error: "Invalid chapter." };
  }

  await db.update(user).set({ name, phone }).where(eq(user.userId, session.userId));

  return { ok: true };
}
