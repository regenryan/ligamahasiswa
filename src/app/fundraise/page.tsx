import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";

async function getActiveCampaigns() {
  try {
    const rows = await readSheet("Campaigns", { status: "Active" });
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      summary: r.summary ?? r.description ?? "",
      chapterSlug: r.chapter_slug ?? "",
      href: r.chapter_slug === "malaysia"
        ? `/chapters/malaysia/campaigns/${r.slug}`
        : `/chapters/${r.chapter_slug}/campaigns/${r.slug}`,
    }));
  } catch {
    return [];
  }
}

async function getUpcomingEvents() {
  try {
    const rows = await readSheet("Events");
    return rows.slice(0, 6).map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      chapterSlug: r.chapter_slug ?? "",
      href: r.chapter_slug === "malaysia"
        ? `/events/${r.slug}`
        : `/chapters/${r.chapter_slug}/events/${r.slug}`,
    }));
  } catch {
    return [];
  }
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default async function FundraisePage() {
  const [campaigns, events] = await Promise.all([getActiveCampaigns(), getUpcomingEvents()]);

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Fundraise"
        title="Fund the fight"
        sub="Every ringgit goes to campaigns, prints, and the next assembly."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Active campaigns" sub="Choose a campaign to support directly." />
          {campaigns.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No active fundraising campaigns right now.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {campaigns.map((c) => (
                <Link key={c.slug} href={c.href} className="border border-line bg-cream p-6 hover:border-brand transition-colors">
                  <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    {c.chapterSlug === "malaysia" ? "National" : c.chapterSlug.toUpperCase()}
                  </span>
                  <h3 className="mt-2 display text-xl">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/60">{c.summary}</p>
                  <span className="mt-4 inline-flex text-[12px] font-extrabold uppercase tracking-[0.12em] text-brand-text">
                    View campaign
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Upcoming events" sub="Attend, RSVP, and contribute your time." />
          {events.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No upcoming events. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => {
                const [, mon, day] = e.date.split("-").map(Number);
                const monthLabel = MONTHS[(mon ?? 1) - 1];
                return (
                  <Link key={e.slug} href={e.href} className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="display text-2xl leading-none">{String(day ?? 1).padStart(2, "0")}</span>
                        <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{monthLabel}</span>
                      </div>
                      <div>
                        <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{e.chapterSlug === "malaysia" ? "National" : e.chapterSlug.toUpperCase()}</span>
                        <h3 className="display text-lg">{e.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={3} title="How to contribute" sub="Multiple ways to support the movement." />
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { title: "Shop", desc: "Buy merch. Every ringgit funds campaigns.", href: "/shop" },
              { title: "Donate", desc: "Pick a campaign and fund it directly.", href: "/chapters/malaysia/campaigns" },
              { title: "Join", desc: "Become a member. Organize on the ground.", href: "/register" },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
                <h3 className="display text-lg text-fog">{item.title}</h3>
                <p className="mt-2 text-[13px] text-fog/60">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
