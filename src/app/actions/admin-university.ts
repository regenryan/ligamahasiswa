"use server";

import { db } from "@/lib/db";
import { university, chapter } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export async function approveUniversity(universityId: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };

  const unis = await db.select().from(university).where(eq(university.universityId, universityId));
  const uni = unis[0];
  if (!uni) return { ok: false, error: "University not found" };

  // Update university status
  await db.update(university).set({ status: "active", updatedAt: new Date() }).where(eq(university.universityId, universityId));

  // Auto-create chapter
  const chapterId = `ch_${crypto.randomUUID().replace(/-/g, "")}`;
  const chapterSlug = `liga${uni.slug.replace(/universiti-|university-/, "")}`; // e.g., ligaum

  await db.insert(chapter).values({
    chapterId,
    universityId: uni.universityId,
    slug: chapterSlug,
    name: `Liga Mahasiswa ${uni.name}`,
    type: "university",
    createdBy: u.id,
  });

  return { ok: true };
}

export async function rejectUniversity(universityId: string) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin") return { ok: false, error: "Unauthorized" };

  await db.update(university).set({ status: "rejected", updatedAt: new Date() }).where(eq(university.universityId, universityId));
  return { ok: true };
}