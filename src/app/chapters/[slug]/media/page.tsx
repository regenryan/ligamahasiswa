import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";

type MediaEntry = {
  id: string;
  type: "Article" | "Statement" | "Zine" | "Event";
  title: string;
  excerpt: string;
  date: string;
  url: string;
};

async function getChapterMedia(slug: string): Promise<MediaEntry[]> {
  const entries: MediaEntry[] = [];

  try {
    const statements = await readSheet("Statements", { chapter_slug: slug });
    for (const r of statements) {
      entries.push({
        id: `stmt-${r.slug}`,
        type: "Statement",
        title: r.title ?? "",
        excerpt: (r.content ?? "").slice(0, 160),
        date: r.date ?? "",
        url: `/chapters/${slug}/statements/${r.slug}`,
      });
    }
  } catch { /* */ }

  try {
    const zines = await readSheet("Zines", { chapter_slug: slug, status: "approved" });
    for (const r of zines) {
      entries.push({
        id: `zine-${r.slug}`,
        type: "Zine",
        title: r.title ?? "",
        excerpt: r.excerpt ?? (r.content ?? "").slice(0, 160),
        date: r.created_at ?? "",
        url: "/zine",
      });
    }
  } catch { /* */ }

  try {
    const events = await readSheet("Events", { chapter_slug: slug });
    for (const r of events) {
      entries.push({
        id: `event-${r.slug}`,
        type: "Event",
        title: r.title ?? "",
        excerpt: r.blurb ?? r.description ?? "",
        date: r.date ?? "",
        url: `/chapters/${slug}/events/${r.slug}`,
      });
    }
  } catch { /* */ }

  try {
    const news = await readSheet("News");
    for (const r of news) {
      entries.push({
        id: `news-${r.url ?? r.title}`,
        type: "Article",
        title: r.title ?? "",
        excerpt: r.outlet ?? "",
        date: r.fetched_at ?? "",
        url: r.url ?? "#",
      });
    }
  } catch { /* */ }

  return entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

const TYPE_SKIN: Record<MediaEntry["type"], string> = {
  Article: "border-brand/40 bg-brand/10 text-brand-text",
  Statement: "border-term/40 bg-term/10 text-term",
  Zine: "border-pink/40 bg-pink/10 text-pink",
  Event: "border-hi/40 bg-hi/10 text-hi",
};

export default async function ChapterMediaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const allEntries = await getChapterMedia(slug);
  const page = Math.max(1, Number(sp.page ?? "1"));
  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(allEntries.length / PAGE_SIZE));
  const entries = allEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.name}
        title="Media"
        sub={`Statements, zine posts, and event coverage from ${ch.short}.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="All content" sub={`From the ${ch.short} chapter.`} />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={entry.url}
                className="border border-line bg-cream p-6 hover:border-brand transition-colors"
              >
                <span className={`inline-flex border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${TYPE_SKIN[entry.type]}`}>
                  {entry.type}
                </span>
                <h3 className="mt-3 display text-xl">{entry.title}</h3>
                <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{entry.excerpt}</p>
              </Link>
            ))}
          </div>
          {entries.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No content from this chapter yet.</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={`/chapters/${slug}/media?page=${page - 1}`} className="press border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
                  Previous
                </Link>
              )}
              <span className="mono text-[12px] text-ink/50">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/chapters/${slug}/media?page=${page + 1}`} className="press border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
                  View more
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      <Link href={`/chapters/${slug}`} className="mx-auto block w-full max-w-6xl border-b border-line px-4 py-6 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/50 hover:text-brand transition-colors">
        Back to chapter
      </Link>
    </Shell>
  );
}
