import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";

const DIR = 27;

type MediaEntry = {
  id: string;
  type: "Article" | "Statement" | "Zine" | "Event";
  title: string;
  excerpt: string;
  chapter: string;
  date: string;
  url: string;
};

async function getMediaEntries(): Promise<MediaEntry[]> {
  const entries: MediaEntry[] = [];

  try {
    const news = await readSheet("News");
    for (const r of news) {
      entries.push({
        id: `news-${r.url ?? r.title}`,
        type: "Article",
        title: r.title ?? "",
        excerpt: r.outlet ?? "",
        chapter: "malaysia",
        date: r.fetched_at ?? "",
        url: r.url ?? "#",
      });
    }
  } catch { /* */ }

  try {
    const statements = await readSheet("Statements");
    for (const r of statements) {
      entries.push({
        id: `stmt-${r.slug}`,
        type: "Statement",
        title: r.title ?? "",
        excerpt: (r.content ?? "").slice(0, 160),
        chapter: r.chapter_slug ?? "malaysia",
        date: r.date ?? "",
        url: r.chapter_slug === "malaysia"
          ? `/statements/${r.slug}`
          : `/chapters/${r.chapter_slug}/statements/${r.slug}`,
      });
    }
  } catch { /* */ }

  try {
    const zines = await readSheet("Zines", { status: "approved" });
    for (const r of zines) {
      entries.push({
        id: `zine-${r.slug}`,
        type: "Zine",
        title: r.title ?? "",
        excerpt: r.excerpt ?? (r.content ?? "").slice(0, 160),
        chapter: r.chapter_slug ?? "malaysia",
        date: r.created_at ?? "",
        url: "/zine",
      });
    }
  } catch { /* */ }

  try {
    const events = await readSheet("Events");
    for (const r of events) {
      entries.push({
        id: `event-${r.slug}`,
        type: "Event",
        title: r.title ?? "",
        excerpt: r.blurb ?? r.description ?? "",
        chapter: r.chapter_slug ?? "malaysia",
        date: r.date ?? "",
        url: r.chapter_slug === "malaysia"
          ? `/events/${r.slug}`
          : `/chapters/${r.chapter_slug}/events/${r.slug}`,
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

function chapterLabel(ch: string) {
  return ch === "malaysia" ? "National" : ch.toUpperCase();
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const params = await searchParams;
  const allEntries = await getMediaEntries();
  const typeFilter = params.type;
  const page = Math.max(1, Number(params.page ?? "1"));
  const PAGE_SIZE = 12;

  const filtered = typeFilter
    ? allEntries.filter((e) => e.type === typeFilter)
    : allEntries;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const entries = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const types = ["Article", "Statement", "Zine", "Event"] as const;

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Media"
        title="Media"
        sub="Stories, coverage, and voices from the movement."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            index={1}
            title="All content"
            sub="Articles, statements, zine posts, and event coverage."
          />

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/media"
              className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                !typeFilter
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              All
            </Link>
            {types.map((t) => (
              <Link
                key={t}
                href={`/media?type=${t}`}
                className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  typeFilter === t
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={entry.url}
                className="border border-line bg-cream p-6 hover:border-brand transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${TYPE_SKIN[entry.type]}`}>
                    {entry.type}
                  </span>
                  <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    {chapterLabel(entry.chapter)}
                  </span>
                </div>
                <h3 className="mt-3 display text-xl">{entry.title}</h3>
                <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{entry.excerpt}</p>
              </Link>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No content available yet.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link
                  href={`/media?page=${page - 1}${typeFilter ? `&type=${typeFilter}` : ""}`}
                  className="press border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="mono text-[12px] text-ink/50">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/media?page=${page + 1}${typeFilter ? `&type=${typeFilter}` : ""}`}
                  className="press border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors"
                >
                  View more
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line bg-midnight">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
          <div>
            <p className="display text-2xl sm:text-3xl">Media inquiries</p>
            <p className="mono mt-2 text-[14px] text-ink/70">media@ligamahasiswa.my</p>
            <p className="mt-1 max-w-xl text-[13px] text-ink/60">
              Statement requests and interview slots, answered within 48 hours.
            </p>
          </div>
          <a href="mailto:media@ligamahasiswa.my" className="press inline-flex border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity">
            Request a statement
          </a>
        </div>
      </section>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
