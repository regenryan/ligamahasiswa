import Link from "next/link";
import { dbGetEvents, type EventData } from "@/lib/queries";
import { chapterLabel } from "@/lib/chapters";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(date: string): { day: string; month: string; year: string } {
  const [y, mon, d] = date.split("-");
  return {
    day: d ? String(Number(d)).padStart(2, "0") : "",
    month: MONTHS[(Number(mon) ?? 1) - 1] ?? "",
    year: y ?? "",
  };
}

export async function EventsSection() {
  const rows = await dbGetEvents();
  const events = rows.slice(0, 4).map((r) => ({
    slug: r.slug ?? "",
    name: r.name ?? "",
    date: r.date ?? "",
    chapterSlug: "ligamy",
    location: r.location ?? "",
  }));

  const [featured, ...rest] = events;
  const upcoming = rest.slice(0, 3);

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

        {featured ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-5">
            <Link
              href={`/chapters/${featured.chapterSlug}/events/${featured.slug}`}
              className="group flex flex-col border border-line bg-cream p-6 lg:col-span-3 hover:border-brand transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{chapterLabel(featured.chapterSlug)}</span>
              </div>
              <div className="mt-4 flex items-baseline gap-4">
                <div className="flex flex-col items-center">
                  <span className="display text-5xl leading-none">{formatDate(featured.date).day}</span>
                  <span className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">{formatDate(featured.date).month}</span>
                </div>
                <div>
                  <h3 className="display text-2xl leading-none">{featured.name}</h3>
                  {featured.location ? <p className="mono mt-2 text-[12px] text-ink/50">{featured.location}</p> : null}
                </div>
              </div>
              <p className="mono mt-6 text-[12px] font-bold uppercase tracking-[0.12em] text-brand group-hover:underline group-hover:underline-offset-4">
                View event →
              </p>
            </Link>

            <div className="flex flex-col gap-0 lg:col-span-2">
              {upcoming.map((e) => {
                const fd = formatDate(e.date);
                return (
                  <Link
                    key={e.slug}
                    href={`/chapters/${e.chapterSlug}/events/${e.slug}`}
                    className="group flex items-center gap-4 border border-line bg-cream p-4 hover:border-brand transition-colors"
                  >
                    <div className="flex w-12 shrink-0 flex-col items-center">
                      <span className="display text-xl leading-none">{fd.day}</span>
                      <span className="mono text-[9px] uppercase tracking-[0.16em] text-ink/50">{fd.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="display text-sm leading-tight truncate">{e.name}</p>
                      <p className="mono mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink/40 truncate">{chapterLabel(e.chapterSlug)}{e.location ? ` · ${e.location}` : ""}</p>
                    </div>
                  </Link>
                );
              })}
              {upcoming.length === 0 && (
                <div className="flex flex-1 items-center justify-center border border-dashed border-line p-8">
                  <p className="text-[14px] text-ink/50">No upcoming events.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-line p-8 text-center">
            <p className="text-[14px] text-ink/50">No events scheduled yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
