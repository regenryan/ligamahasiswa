import { Shell } from "@/components/shells";
import { PageHead, SectionHead, EventCard } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { events as mockEvents, chapters as mockChapters } from "@/lib/mock";
import type { EventItem } from "@/lib/mock";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getChapterEvents(slug: string): Promise<EventItem[]> {
  try {
    const rows = await readSheet("Events", { chapter_slug: slug });
    if (rows.length === 0) {
      return mockEvents.filter((e) => e.chapterSlug === slug);
    }
    return rows.map((r) => ({
      slug: r.slug ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      time: r.time ?? "",
      place: r.place ?? r.location ?? "",
      type: (r.type as EventItem["type"]) ?? "Forum",
      blurb: r.blurb ?? r.description ?? "",
    }));
  } catch {
    return mockEvents.filter((e) => e.chapterSlug === slug);
  }
}

export default async function ChapterEventsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug);
  if (!ch) notFound();
  const events = await getChapterEvents(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.name}
        title="Events"
        sub={`Events and assemblies for the ${ch.short} chapter.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link
            href={`/chapters/${slug}`}
            className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
          >
            {"\u2190"} Back to chapter
          </Link>
          {events.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No events scheduled yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <Link key={e.slug} href={`/chapters/${slug}/events/${e.slug}`}>
                  <EventCard e={e} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
