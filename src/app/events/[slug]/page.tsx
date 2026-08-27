import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { dbGetEventBySlug } from "@/lib/queries";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";
import { RsvpButton } from "@/components/RsvpButton";
import { ShareKit } from "@/components/ShareKit";
import { SkeletonDetail } from "@/components/skeleton";

type EventItem = {
  slug: string;
  chapterSlug: string;
  title: string;
  date: string;
  time: string;
  place: string;
  type: "Forum" | "Assembly" | "Dialogue";
  blurb: string;
};

async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    const r = await dbGetEventBySlug(slug);
    if (r) {
      return {
        slug: r.slug,
        chapterSlug: r.chapterSlug,
        title: r.name,
        date: r.date,
        time: r.time,
        place: r.location,
        type: (r.type as EventItem["type"]) || "Forum",
        blurb: r.description,
      };
    }
  } catch {
    // fall through
  }
  return null;
}

async function EventContent({ slug }: { slug: string }) {
  const event = await getEvent(slug);
  if (!event) {
    return (
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-[14px] text-ink/60">Event not found.</p>
          <Link href="/events" className="mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} All events
          </Link>
        </div>
      </section>
    );
  }

  const [, mon, day] = event.date.split("-").map(Number);
  const monthLabel = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][(mon ?? 1) - 1];

  return (
    <>
      <PageHead
        kicker={`Events / ${chapterLabel(event.chapterSlug)}`}
        title={event.title}
        sub={event.blurb}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/events" className="mono mb-8 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} All events
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
              <RsvpButton eventSlug={slug} />
            </div>
          </div>
          <div className="mt-8">
            <ShareKit title={event.title} url={`https://ligamahasiswa.vercel.app/events/${slug}`} />
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
              href={`/chapters/${event.chapterSlug}/events/${slug}/fundraise`}
              className="press inline-flex border-2 border-fog bg-fog/10 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog hover:bg-fog/20 transition-colors"
            >
              Fundraise
            </Link>
          </div>
        </div>
      </section>
      <JoinBand />
    </>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Shell dir={27}>
      <Suspense fallback={<SkeletonDetail />}>
        <EventContent slug={slug} />
      </Suspense>
    </Shell>
  );
}
