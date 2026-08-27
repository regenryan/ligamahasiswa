"use server";

import { db } from "@/lib/db";
import { university } from "@/lib/schema";
import { getSession } from "@/lib/session";
import { generateSlug } from "@/lib/slug";
import crypto from "crypto";

export type UniversityState = { ok: boolean; error?: string } | undefined;

export async function submitUniversity(
  _prev: UniversityState,
  formData: FormData,
): Promise<UniversityState> {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, error: "Login required to submit a university." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3) {
    return { ok: false, error: "University name must be at least 3 characters." };
  }

  const slug = generateSlug(name);
  const id = `uni_${crypto.randomUUID().replace(/-/g, "")}`;

  try {
    await db.insert(university).values({
      universityId: id,
      slug,
      name,
      status: "pending",
    });
    return { ok: true };
  } catch (err: any) {
    if (err.message?.includes("UNIQUE constraint failed: university.slug")) {
      return { ok: false, error: "This university has already been submitted." };
    }
    return { ok: false, error: "Failed to submit university. Please try again." };
  }
}
