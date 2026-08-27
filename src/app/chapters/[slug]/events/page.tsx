import { Shell } from "@/components/shells";
import { PageHead, EventCard } from "@/components/sections";
import { getChapter, CHAPTERS } from "@/lib/chapters";
import { dbGetEventsByChapter } from "@/lib/queries";
import type { EventData } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getChapterEvents(slug: string): Promise<EventData[]> {
  const chapterId = await getChapterId(slug);
  if (!chapterId) return [];
  return dbGetEventsByChapter(chapterId);
}

async function getChapterId(slug: string): Promise<string | null> {
  const chapter = await getChapter(slug);
  return chapter?.chapterId ?? null;
}

export default async function ChapterEventsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = CHAPTERS.find((c) => c.slug === slug);
  if (!ch) notFound();
  const events = await getChapterEvents(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.label}
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
                  <EventCard e={{ ...e, title: e.name, place: e.location, blurb: e.description, type: e.type as any, chapterSlug: e.chapterSlug || "" }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
