import { readSheet } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";

type Event = {
  slug: string;
  title: string;
  date: string;
  chapterSlug: string;
  place: string;
};

async function getRecentEvents(): Promise<Event[]> {
  try {
    const rows = await readSheet("Events");
    return rows.slice(0, 4).map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      chapterSlug: r.chapter_slug ?? "ligamy",
      place: r.place ?? r.location ?? "",
    }));
  } catch {
    return [];
  }
}

export async function EventsSection() {
  const events = await getRecentEvents();

  return (
    <section className="border-b border-line" id="events">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Happening soon</p>
            <h2 className="display mt-2 text-3xl sm:text-5xl">Events</h2>
          </div>
          <Link href="/events" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Link
              key={e.slug}
              href={`/chapters/${e.chapterSlug}/events/${e.slug}`}
              className="border border-line bg-cream p-5 hover:border-brand transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{e.date}</span>
                <span className="mono text-[10px] uppercase tracking-[0.12em] text-ink/40">{chapterLabel(e.chapterSlug)}</span>
              </div>
              <h3 className="mt-2 display text-lg">{e.title}</h3>
              {e.place ? <p className="mt-1 mono text-[12px] text-ink/50">{e.place}</p> : null}
            </Link>
          ))}
        </div>
        {events.length === 0 && (
          <p className="mt-8 text-center text-[14px] text-ink/50">No events scheduled yet.</p>
        )}
      </div>
    </section>
  );
}
