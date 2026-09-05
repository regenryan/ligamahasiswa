import "server-only";
import { cache } from "react";
import { db } from "./db";
import { chapter } from "./schema";
import { CHAPTERS, getChapterSync, chapterLabel, type ChapterSlug } from "./chapter-constants";

export { CHAPTERS, getChapterSync, chapterLabel };
export type { ChapterSlug };

export interface Chapter {
  chapterId: string;
  slug: string;
  name: string;
  slogan: string | null;
  social: string | null;
  type: string;
}

export const getChapters = cache(async (): Promise<Chapter[]> => {
  return db.select().from(chapter);
});

export async function getChapter(slug: string): Promise<Chapter | null> {
  const chapters = await getChapters();
  return chapters.find((c) => c.slug === slug) ?? null;
}
