import { Suspense } from "react";
import { MediaSection } from "@/components/sections/media-section";
import { SkeletonMediaGrid } from "@/components/skeleton";
import { readSheet } from "@/lib/sheets-db";

type MediaItem = {
  id: string;
  type: "Article" | "Statement" | "Zine" | "Social";
  title: string;
  chapter: string;
  date: string;
  url: string;
};

async function getMediaItems(): Promise<MediaItem[]> {
  const [newsResult, stmtResult, zineResult, socialResult] = await Promise.allSettled([
    readSheet("News"),
    readSheet("Statements"),
    readSheet("Zines", { status: "approved" }),
    readSheet("Social"),
  ]);

  const items: MediaItem[] = [];

  if (newsResult.status === "fulfilled") {
    for (const r of newsResult.value) {
      items.push({
        id: `news-${r.url ?? r.title}`,
        type: "Article",
        title: r.title ?? "",
        chapter: "ligamy",
        date: r.fetched_at ?? "",
        url: r.url ?? "#",
      });
    }
  }

  if (stmtResult.status === "fulfilled") {
    for (const r of stmtResult.value) {
      items.push({
        id: `stmt-${r.slug}`,
        type: "Statement",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.date ?? "",
        url: `/chapters/${r.chapter_slug}/statements/${r.slug}`,
      });
    }
  }

  if (zineResult.status === "fulfilled") {
    for (const r of zineResult.value) {
      items.push({
        id: `zine-${r.slug}`,
        type: "Zine",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.created_at ?? "",
        url: "/media",
      });
    }
  }

  if (socialResult.status === "fulfilled") {
    for (const r of socialResult.value) {
      items.push({
        id: r.id ?? `social-${r.url}`,
        type: "Social",
        title: r.caption ?? r.platform ?? "Social post",
        chapter: "ligamy",
        date: r.date ?? r.created_at ?? "",
        url: r.url ?? "#",
      });
    }
  }

  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

async function MediaSectionInner() {
  const items = await getMediaItems();
  return <MediaSection items={items} />;
}

export function MediaSectionAsync() {
  return (
    <Suspense fallback={<SkeletonMediaGrid />}>
      <MediaSectionInner />
    </Suspense>
  );
}
