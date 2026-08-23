"use server";

import { redirect } from "next/navigation";
import { writeSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";

export type ZineState = { error?: string } | undefined;

export async function submitZine(
  _prev: ZineState,
  formData: FormData,
): Promise<ZineState> {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "You must be logged in to submit a zine." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const chapterSlug = String(formData.get("chapter") ?? "").trim();

  if (title.length < 3) return { error: "Title must be at least 3 characters." };
  if (content.length < 50) return { error: "Content must be at least 50 characters." };
  if (!chapterSlug) return { error: "Pick your chapter." };

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const result = await writeSheet("Zines", {
    slug,
    title,
    author: session.userId,
    chapter_slug: chapterSlug,
    content,
    excerpt: content.slice(0, 200),
    likes: "0",
    status: "pending",
    created_at: new Date().toISOString(),
  });

  if (!result.ok) {
    return { error: result.error ?? "Submission failed. Try again." };
  }

  redirect("/media");
}
