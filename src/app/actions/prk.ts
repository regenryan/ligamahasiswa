"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { nomination } from "@/lib/schema";
import { getSession } from "@/lib/session";

export type PrkState = { error?: string } | undefined;

export async function submitNomination(
  _prev: PrkState,
  formData: FormData,
): Promise<PrkState> {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "You must be logged in to nominate." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const chapterSlug = String(formData.get("chapter") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const statement = String(formData.get("statement") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (name.length < 2) return { error: "Enter the nominee's full name." };
  if (!chapterSlug) return { error: "Pick a chapter." };
  if (position.length < 2) return { error: "Enter the position they are running for." };
  if (statement.length < 10) return { error: "Write at least a short platform statement." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };

  const id = `prk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  await db.insert(nomination).values({
    nominationId: id,
    name,
    email,
    chapterId: chapterSlug,
    justification: `${position}: ${statement}`,
    status: "pending",
  });

  redirect("/election?submitted=1");
}
