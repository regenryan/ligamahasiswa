import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { MediaClient } from "./media-client";

const DIR = 27;

async function getPosts() {
  try {
    const rows = await readSheet("Social");
    return rows.map((r) => ({
      id: r.id ?? `social-${r.url}`,
      platform: (r.platform ?? "instagram").toLowerCase(),
      caption: r.caption ?? "",
      url: r.url ?? "#",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getZines() {
  try {
    const rows = await readSheet("Zines", { status: "approved" });
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      excerpt: r.excerpt ?? (r.content ?? "").slice(0, 160),
      author: r.author ?? "",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getStatements() {
  try {
    const rows = await readSheet("Statements");
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      preview: (r.content ?? "").slice(0, 160),
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getPodcasts() {
  try {
    const rows = await readSheet("Podcasts" as Parameters<typeof readSheet>[0]);
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getArticles() {
  try {
    const rows = await readSheet("News");
    return rows.map((r) => ({
      title: r.title ?? "",
      outlet: r.outlet ?? "",
      url: r.url ?? "#",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

export default async function MediaPage() {
  const [posts, zines, statements, podcasts, articles] = await Promise.all([
    getPosts(),
    getZines(),
    getStatements(),
    getPodcasts(),
    getArticles(),
  ]);

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Media"
        title="Media"
        sub="Stories, coverage, and voices from the movement."
      />
      <MediaClient data={{ posts, zines, statements, podcasts, articles }} />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
