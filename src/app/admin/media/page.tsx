import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { media, chapter } from "@/lib/schema";
import Link from "next/link";
import { AdminMediaClient } from "./client";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <Link href="/dashboard" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper">Back to dashboard</Link>
          </div>
        </section>
      </Shell>
    );
  }

  const mediaRows = await db.select().from(media);
  const chaptersRows = await db.select().from(chapter);

  const chaptersMap = new Map(chaptersRows.map(c => [c.chapterId, c.name]));

  const formattedMedia = mediaRows.map(m => ({
    id: m.mediaId,
    name: m.name ?? "Untitled",
    link: m.link,
    type: m.type ?? "article",
    date: m.date ?? m.createdAt?.toISOString().split('T')[0] ?? "",
    chapter: m.chapterId ? (chaptersMap.get(m.chapterId) ?? m.chapterId) : "Global",
  })).sort((a, b) => b.date.localeCompare(a.date));

  const chapters = chaptersRows.map(c => ({
    id: c.chapterId,
    name: c.name
  }));

  return <AdminMediaClient mediaItems={formattedMedia} chapters={chapters} />;
}