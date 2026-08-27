import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { db } from "@/lib/db";
import * as s from "@/lib/schema";
import { getChapter, getChapterSync, CHAPTERS } from "@/lib/chapters";
import { and, eq } from "drizzle-orm";
import type { EventData } from "@/lib/queries";
import Link from "next/link";
import { ShareKit } from "@/components/ShareKit";
import { SkeletonDetail } from "@/components/skeleton";
import { generateSafeHTML } from "@/lib/tiptap";

async function getEvent(chapterSlug: string, eventSlug: string): Promise<EventData | null> {
  const chapter = await getChapter(chapterSlug);
  if (!chapter) return null;
  const rows = await db
    .select()
    .from(s.event)
    .where(and(eq(s.event.chapterId, chapter.chapterId), eq(s.event.slug, eventSlug)));
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.eventId,
    chapterSlug,
    chapterId: r.chapterId,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    location: r.location ?? "",
    date: r.date ?? "",
    time: r.time ?? "",
    type: r.type ?? "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
    updatedAt: r.updatedAt ? String(r.updatedAt) : "",
  };
}

async function ChapterEventContent({ slug, eventSlug }: { slug: string; eventSlug: string }) {
  const ch = getChapterSync(slug) ?? CHAPTERS[0];
  const event = await getEvent(slug, eventSlug);

  if (!event) {
    return (
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-[14px] text-ink/60">Event not found.</p>
          <Link href={`/chapters/${slug}/events`} className="mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to events
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
        kicker={`${ch.label} / Events`}
        title={event.name}
        sub={event.description}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href={`/chapters/${slug}/events`} className="mono mb-8 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to events
          </Link>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div 
                className="prose prose-sm sm:prose lg:prose-lg max-w-none text-ink/70 prose-a:text-brand hover:prose-a:text-brand/80" 
                dangerouslySetInnerHTML={{ __html: generateSafeHTML(event.description) }} 
              />
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
                  <p className="text-[14px]">{event.location}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Type</p>
                  <p className="text-[14px]">{event.type}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <ShareKit title={event.name} url={`https://ligamahasiswa.vercel.app/chapters/${slug}/events/${eventSlug}`} />
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
    </>
  );
}

export default async function ChapterEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}) {
  const { slug, event: eventSlug } = await params;
  const ch = getChapterSync(slug) ?? CHAPTERS[0];

  return (
    <Shell dir={27}>
      <Suspense fallback={<SkeletonDetail />}>
        <ChapterEventContent slug={slug} eventSlug={eventSlug} />
      </Suspense>
    </Shell>
  );
}
