import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { EventCard } from "@/components/sections/cards";
import { readSheet } from "@/lib/sheets-db";
import { events as mockEvents } from "@/lib/mock";
import type { EventItem } from "@/lib/mock";

async function getEvents(): Promise<EventItem[]> {
  try {
    const rows = await readSheet("Events");
    if (rows.length === 0) return mockEvents;
    return rows.map((r) => ({
      slug: r.slug ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      time: r.time ?? "",
      place: r.place ?? "",
      type: (r.type as EventItem["type"]) ?? "Forum",
      blurb: r.blurb ?? "",
    }));
  } catch {
    return mockEvents;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Events"
        title="Show up. Speak out."
        sub="Forums, assemblies, and dialogues across every chapter."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.slug} e={e} />
            ))}
          </div>
          {events.length === 0 ? (
            <p className="text-center text-[14px] text-ink/50">
              No upcoming events yet. Check back soon.
            </p>
          ) : null}
        </div>
      </section>
    </Shell>
  );
}
