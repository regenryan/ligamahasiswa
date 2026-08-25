import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { CHAPTERS, chapterLabel } from "@/lib/chapters";
import { events as mockEvents, type EventItem } from "@/lib/mock";
import { SkeletonEventGrid } from "@/components/skeleton";
import Link from "next/link";

const DIR = 27;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
      place: r.place ?? r.location ?? "",
      type: (r.type as EventItem["type"]) ?? "Forum",
      blurb: r.blurb ?? r.description ?? "",
    }));
  } catch {
    return mockEvents;
  }
}

function formatDate(date: string): string {
  const [, mon, day] = date.split("-").map(Number);
  if (!mon || !day) return date;
  return `${String(day).padStart(2, "0")} ${MONTHS[mon - 1]} ${date.slice(0, 4)}`;
}

function EventCard({ e, hrefOverride }: { e: EventItem; hrefOverride?: string }) {
  const href = hrefOverride ?? `/chapters/${e.chapterSlug}/events/${e.slug}`;
  return (
    <Link
      href={href}
      className="border border-line bg-cream p-5 hover:border-brand transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="border border-line px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/60">
          {chapterLabel(e.chapterSlug)}
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
          {formatDate(e.date)}
        </span>
      </div>
      <h3 className="mt-3 display text-xl">{e.title}</h3>
      <p className="mono mt-2 text-[11px] uppercase tracking-[0.14em] text-ink/50">
        {e.place}
      </p>
    </Link>
  );
}

async function FundraiseGrid() {
  const events = await getEvents();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const fundraisers = sorted.slice(0, 3);
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {fundraisers.map((e) => (
          <EventCard key={`${e.chapterSlug}-${e.slug}`} e={e} hrefOverride={`/chapters/${e.chapterSlug}/events/${e.slug}/fundraise`} />
        ))}
      </div>
      {fundraisers.length === 0 && (
        <div className="border border-dashed border-line p-8 text-center">
          <p className="text-[14px] text-ink/50">No upcoming events right now.</p>
        </div>
      )}
    </>
  );
}

async function AllEvents({ chapterFilter }: { chapterFilter?: string }) {
  const events = await getEvents();
  const filtered = chapterFilter
    ? events.filter((e) => e.chapterSlug === chapterFilter)
    : events;
  return (
    <>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <EventCard key={`${e.chapterSlug}-${e.slug}`} e={e} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="border border-dashed border-line p-8 text-center">
          <p className="text-[14px] text-ink/50">No events for this chapter yet.</p>
        </div>
      )}
    </>
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  const params = await searchParams;
  const chapterFilter = params.chapter;

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Events"
        title="Events"
        sub="Gatherings, rallies, and dialogues."
      />

      <section id="fundraise" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            index={1}
            title="Fundraise"
            sub="Our next three gatherings take donations on the door."
          />
          <Suspense fallback={<SkeletonEventGrid />}>
            <FundraiseGrid />
          </Suspense>
        </div>
      </section>

      <section id="events" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            index={2}
            title="All events"
            sub="Every gathering across every chapter."
          />

          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                !chapterFilter
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              All
            </Link>
            {CHAPTERS.map((ch) => (
              <Link
                key={ch.slug}
                href={`/events?chapter=${ch.slug}`}
                className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  chapterFilter === ch.slug
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                {chapterLabel(ch.slug)}
              </Link>
            ))}
          </div>

          <Suspense fallback={<SkeletonEventGrid />}>
            <AllEvents chapterFilter={chapterFilter} />
          </Suspense>
        </div>
      </section>

      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
