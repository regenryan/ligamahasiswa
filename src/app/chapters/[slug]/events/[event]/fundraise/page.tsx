import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

async function getEvent(chapterSlug: string, eventSlug: string) {
  try {
    const rows = await readSheet("Events", { chapter_slug: chapterSlug, slug: eventSlug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        title: r.title ?? "",
        description: r.description ?? r.blurb ?? "",
        date: r.date ?? "",
        donateUrl: r.donate_url ?? "",
      };
    }
  } catch {
    return null;
  }
  return null;
}

export default async function EventFundraisePage({
  params,
}: {
  params: Promise<{ slug: string; event: string }>;
}) {
  const { slug, event: eventSlug } = await params;
  const event = await getEvent(slug, eventSlug);

  if (!event) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Fundraise" title="Event not found" />
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
  const monthLabel = MONTHS[(mon ?? 1) - 1];
  const dateLabel = `${monthLabel} ${String(day ?? 1).padStart(2, "0")}`;
  const hasDonateUrl = Boolean(event.donateUrl);

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Fundraise"
        title={event.title}
        sub={event.description}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-text">
                  {chapterLabel(slug)}
                </span>
                <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  {dateLabel}
                </span>
              </div>
              <h2 className="mt-5 display text-3xl">{event.title}</h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
                {event.description}
              </p>
            </div>
            <div className="border border-line bg-cream p-6">
              <p className="mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
                Fundraise
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
                Every ringgit raised goes straight into this event: prints,
                venues, and logistics for the movement.
              </p>
              {hasDonateUrl ? (
                <a
                  href={event.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press mt-6 inline-flex w-full items-center justify-center border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-paper hover:opacity-90 transition-opacity"
                >
                  Donate via HitPay
                </a>
              ) : (
                <div className="mt-6">
                  <span className="inline-flex w-full cursor-not-allowed items-center justify-center border-2 border-line bg-fog/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/40">
                    Donate via HitPay
                  </span>
                  <p className="mono mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    Payment link coming soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Other ways to support" sub="Fund the movement beyond this event." />
          <div className="grid gap-5 sm:grid-cols-3">
            <Link href="/shop" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <h3 className="display text-lg text-fog">Shop</h3>
              <p className="mt-2 text-[13px] text-fog/60">Buy merch. Every ringgit funds campaigns.</p>
            </Link>
            <Link href="/chapters/ligamy/campaigns" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <h3 className="display text-lg text-fog">Donate</h3>
              <p className="mt-2 text-[13px] text-fog/60">Pick a campaign and fund it directly.</p>
            </Link>
            <Link href="/register" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <h3 className="display text-lg text-fog">Join</h3>
              <p className="mt-2 text-[13px] text-fog/60">Become a member. Organize on the ground.</p>
            </Link>
          </div>
        </div>
      </section>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
