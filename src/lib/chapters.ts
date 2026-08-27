import { cache } from "react";
import { db } from "./db";
import { chapter } from "./schema";

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

export function chapterLabel(slug: string): string {
  if (slug === "ligamy") return "National";
  return slug.toUpperCase();
}

// Backward-compatible CHAPTERS constant for client components and sync lookups
export const CHAPTERS = [
  { slug: "ligamy", label: "Liga Mahasiswa Malaysia", short: "LigaMY", color: "#e11d2e", tagline: "The national student movement." },
  { slug: "ligaum", label: "Liga Mahasiswa UM", short: "LigaUM", color: "#e11d2e", tagline: "The first campus that dared." },
  { slug: "ligautm", label: "Liga Mahasiswa UTM", short: "LigaUTM", color: "#e11d2e", tagline: "Engineers who refuse to stay quiet." },
  { slug: "ligausm", label: "Liga Mahasiswa USM", short: "LigaUSM", color: "#e11d2e", tagline: "Island, beach, resistance." },
  { slug: "ligaunisza", label: "Liga Mahasiswa UniSZA", short: "LigaUniSZA", color: "#e11d2e", tagline: "Terengganu has its own voice." },
  { slug: "sparcutem", label: "SPARC UTeM", short: "SPARC UTeM", color: "#e11d2e", tagline: "Student power, rise of campus." },
] as const;

export type ChapterSlug = (typeof CHAPTERS)[number]["slug"];

// Sync lookup from CHAPTERS constant (backward-compatible)
export function getChapterSync(slug: string) {
  return CHAPTERS.find((c) => c.slug === slug) ?? null;
}
