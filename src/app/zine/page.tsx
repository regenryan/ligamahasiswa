import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { zinePosts as mockZine } from "@/lib/mock";
import type { ZinePost } from "@/lib/mock";
import { ZineGridClient } from "./zine-grid-client";

const DIR = 27;

async function getZinePosts(): Promise<ZinePost[]> {
  try {
    const rows = await readSheet("Zines", { status: "approved" });
    if (rows.length === 0) return mockZine;
    return rows.map((r) => ({
      slug: r.slug ?? "",
      author: r.author ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      excerpt: r.excerpt ?? (r.content ?? "").slice(0, 200),
      likes: Number(r.likes ?? "0"),
    }));
  } catch {
    return mockZine;
  }
}

export default async function ZinePage() {
  const posts = await getZinePosts();

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Zine"
        title="The zine"
        sub="Essays, letters, and notes from the movement. Written by students, printed when we can afford it."
      />
      <ZineGridClient posts={posts} />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
