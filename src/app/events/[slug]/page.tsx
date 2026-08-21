import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { events as mockEvents } from "@/lib/mock";
import type { EventItem } from "@/lib/mock";
import Link from "next/link";

async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    const rows = await readSheet("Events", { slug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? "",
        chapterSlug: r.chapter_slug ?? "",
        title: r.title ?? "",
        date: r.date ?? "",
        time: r.time ?? "",
        place: r.place ?? "",
        type: (r.type as EventItem["type"]) ?? "Forum",
        blurb: r.blurb ?? "",
      };
    }
  } catch {
    // fall through
  }
  return mockEvents.find((e) => e.slug === slug) ?? null;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Events" title="Event not found" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/events" className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
            {"\u2190"} All events
          </Link>
        </div>
      </Shell>
    );
  }

  const [, mon, day] = event.date.split("-").map(Number);
  const monthLabel = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][(mon ?? 1) - 1];

  return (
    <Shell dir={27}>
      <PageHead
        kicker={`Events / ${event.chapterSlug === "malaysia" ? "National" : event.chapterSlug.toUpperCase()}`}
        title={event.title}
        sub={event.blurb}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="text-[15px] leading-relaxed text-ink/70">{event.blurb}</p>
            </div>
            <div className="border border-line bg-cream p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Date</p>
                  <p className="text-[14px] font-bold">{monthLabel} {String(day ?? 1).padStart(2, "0")}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Time</p>
                  <p className="text-[14px]">{event.time}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Location</p>
                  <p className="text-[14px]">{event.place}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Type</p>
                  <p className="text-[14px]">{event.type}</p>
                </div>
              </div>
              <Link
                href="/register"
                className="press mt-6 block w-full border border-2 border-ink bg-brand px-5 py-3 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150"
              >
                RSVP
              </Link>
            </div>
          </div>
          <Link href="/events" className="press mt-8 inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
            {"\u2190"} All events
          </Link>
        </div>
      </section>
    </Shell>
  );
}
