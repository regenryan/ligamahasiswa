import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { events as mockEvents, chapters as mockChapters } from "@/lib/mock";
import type { EventItem } from "@/lib/mock";
import Link from "next/link";
import { RsvpButton } from "@/components/RsvpButton";
import { ShareKit } from "@/components/ShareKit";

async function getEvent(chapterSlug: string, eventSlug: string): Promise<EventItem | null> {
  try {
    const rows = await readSheet("Events", { slug: eventSlug, chapter_slug: chapterSlug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? "",
        chapterSlug: r.chapter_slug ?? "",
        title: r.title ?? "",
        date: r.date ?? "",
        time: r.time ?? "",
        place: r.place ?? r.location ?? "",
        type: (r.type as EventItem["type"]) ?? "Forum",
        blurb: r.blurb ?? r.description ?? "",
      };
    }
  } catch {
    // fall through
  }
  return mockEvents.find((e) => e.slug === eventSlug && e.chapterSlug === chapterSlug) ?? null;
}

export default async function ChapterEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}) {
  const { slug, event: eventSlug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const event = await getEvent(slug, eventSlug);

  if (!event) {
    return (
      <Shell dir={27}>
        <PageHead kicker={ch.name} title="Event not found" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <Link href={`/chapters/${slug}/events`} className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
              {"\u2190"} Back to events
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const [, mon, day] = event.date.split("-").map(Number);
  const monthLabel = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][(mon ?? 1) - 1];

  return (
    <Shell dir={27}>
      <PageHead
        kicker={`${ch.name} / Events`}
        title={event.title}
        sub={event.blurb}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href={`/chapters/${slug}/events`} className="mono mb-8 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to events
          </Link>
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
              <RsvpButton eventSlug={eventSlug} />
            </div>
          </div>
          <div className="mt-8">
            <ShareKit title={event.title} url={`https://ligamahasiswa.vercel.app/chapters/${slug}/events/${eventSlug}`} />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 border border-fog/20 bg-fog/5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[15px] font-bold text-fog">Support this event</p>
              <p className="mono mt-1 text-[12px] text-fog/60">Every contribution helps fund our work.</p>
            </div>
            <Link
              href={`/chapters/${slug}/events/${eventSlug}/fundraise`}
              className="press inline-flex border-2 border-fog bg-fog/10 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog hover:bg-fog/20 transition-colors"
            >
              Fundraise
            </Link>
          </div>
        </div>
      </section>
      <JoinBand />
    </Shell>
  );
}
