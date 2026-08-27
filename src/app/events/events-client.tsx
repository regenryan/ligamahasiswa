"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { CHAPTERS, chapterLabel } from "@/lib/chapters";
import type { EventData } from "@/lib/queries";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FILTER_BTN =
  "press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors";

function formatDate(date: string): string {
  const [, mon, day] = date.split("-").map(Number);
  if (!mon || !day) return date;
  return `${String(day).padStart(2, "0")} ${MONTHS[mon - 1]} ${date.slice(0, 4)}`;
}

function EventCard({ e, hrefOverride }: { e: EventData; hrefOverride?: string }) {
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
      <h3 className="mt-3 display text-xl">{e.name}</h3>
      <p className="mono mt-2 text-[11px] uppercase tracking-[0.14em] text-ink/50">
        {e.location}
      </p>
    </Link>
  );
}

export function EventsClient({ events }: { events: EventData[] }) {
  const [chapter, setChapter] = useState<string>("");

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const fundraisers = sorted.slice(0, 3);
  const all = chapter
    ? events.filter((e) => e.chapterSlug === chapter)
    : events;

  const updateUrl = useCallback((slug: string) => {
    const url = slug ? `/events?chapter=${slug}` : "/events";
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <>
      <section id="fundraise" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 01</p>
          <h2 className="display mt-2 text-2xl">Fundraise</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Our next three gatherings take donations on the door.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fundraisers.map((e) => (
              <EventCard key={`${e.chapterSlug}-${e.slug}`} e={e} hrefOverride={`/chapters/${e.chapterSlug}/events/${e.slug}/fundraise`} />
            ))}
          </div>
          {fundraisers.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No upcoming events right now.</p>
            </div>
          )}
        </div>
      </section>

      <section id="events" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 02</p>
          <h2 className="display mt-2 text-2xl">All events</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Every gathering across every chapter.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => { setChapter(""); updateUrl(""); }}
              className={`${FILTER_BTN} ${!chapter ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
            >
              All
            </button>
            {CHAPTERS.map((ch) => (
              <button
                key={ch.slug}
                onClick={() => { setChapter(ch.slug); updateUrl(ch.slug); }}
                className={`${FILTER_BTN} ${chapter === ch.slug ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
              >
                {chapterLabel(ch.slug)}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {all.map((e) => (
              <EventCard key={`${e.chapterSlug}-${e.slug}`} e={e} />
            ))}
          </div>
          {all.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No events for this chapter yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
