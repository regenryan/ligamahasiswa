"use server";

import { getSession } from "@/lib/session";
import { updateSheet } from "@/lib/sheets-db";

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

  const result = await updateSheet("Users", "id", session.userId, {
    name,
    chapter_slug: chapter,
    phone,
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Update failed. Try again." };
  }

  return { ok: true };
}
