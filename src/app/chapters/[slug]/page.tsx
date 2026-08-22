import { Shell } from "@/components/shells";
import { PageHead, SectionHead, EventCard } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters, campaigns as mockCampaigns, events as mockEvents, members as mockMembers } from "@/lib/mock";
import type { Campaign, EventItem } from "@/lib/mock";
import Link from "next/link";
import { MalaysiaMap } from "@/components/MalaysiaMap";

const DIR = 27;

function getChapterData(slug: string) {
  return mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
}

async function getChapterCampaigns(slug: string): Promise<Campaign[]> {
  try {
    const rows = await readSheet("Campaigns", { chapter_slug: slug });
    if (rows.length === 0) {
      return mockCampaigns.filter((c) => c.chapterSlug === slug).slice(0, 3);
    }
    return rows.map((r) => ({
      slug: r.slug ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      status: (r.status as Campaign["status"]) ?? "Active",
      summary: r.summary ?? r.description ?? "",
      demands: r.demands ? JSON.parse(r.demands) : [],
      timeline: r.timeline ? JSON.parse(r.timeline) : [],
      hasTicker: r.has_ticker === "true",
    }));
  } catch {
    return mockCampaigns.filter((c) => c.chapterSlug === slug).slice(0, 3);
  }
}

async function getChapterEvents(slug: string): Promise<EventItem[]> {
  try {
    const rows = await readSheet("Events", { chapter_slug: slug });
    if (rows.length === 0) {
      return mockEvents.filter((e) => e.chapterSlug === slug);
    }
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
    return mockEvents.filter((e) => e.chapterSlug === slug);
  }
}

async function getChapterMemberCount(slug: string): Promise<number> {
  try {
    const rows = await readSheet("Users", { chapter_slug: slug, status: "approved" });
    return rows.length || mockMembers.filter((m) => m.chapterSlug === slug).length;
  } catch {
    return mockMembers.filter((m) => m.chapterSlug === slug).length;
  }
}

function StatsStrip({
  memberCount,
  campaignCount,
}: {
  memberCount: number;
  campaignCount: number;
}) {
  const stats = [
    { label: "Members", value: String(memberCount).padStart(2, "0") },
    { label: "Campaigns", value: String(campaignCount).padStart(2, "0") },
    { label: "Founded", value: "2024" },
  ];
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border-2 border-ink bg-brand/10 px-4 py-5 sm:px-6">
              <p className="display text-3xl leading-none sm:text-4xl">{s.value}</p>
              <p className="mono mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = getChapterData(slug);
  const campaigns = await getChapterCampaigns(slug);
  const events = await getChapterEvents(slug);
  const memberCount = await getChapterMemberCount(slug);
  const leadCampaign = campaigns[0];

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Chapters" title={ch.name} sub={ch.tagline} />
      <StatsStrip memberCount={memberCount} campaignCount={campaigns.length} />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <SectionHead index={0} title="Our chapters" sub="Find your campus. Every chapter runs its own campaigns and events." />
          <div className="mt-6">
            <MalaysiaMap />
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Campaigns" sub="What this chapter is fighting for right now." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <Link key={c.slug} href={`/chapters/${c.chapterSlug}/campaigns/${c.slug}`} className="border border-line bg-cream p-6 hover:border-brand transition-colors">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{c.chapterSlug === "malaysia" ? "National" : c.chapterSlug.toUpperCase()}</p>
                <h3 className="display mt-2 text-xl">{c.title}</h3>
                <p className="mt-2 text-[14px] text-ink/70 line-clamp-3">{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Upcoming events" sub={`Sessions for the ${ch.short} chapter.`} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? events.map((e) => (
              <EventCard key={e.slug} e={e} />
            )) : (
              <p className="border border-line bg-cream p-6 text-[14px] text-ink/60">Nothing scheduled yet. Check back soon.</p>
            )}
          </div>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-10 sm:px-6">
          <span className="mono mr-1 text-[11px] uppercase tracking-[0.2em] text-ink/50">Jump to</span>
          <Link href={`/chapters/${slug}/team`} className="press inline-flex flex-col gap-1 border-2 border-ink bg-brand/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper">
            <span>Meet the team</span>
            <span className="normal-case tracking-normal text-ink/50">The people behind the chapter</span>
          </Link>
          {leadCampaign ? (
            <Link href={`/chapters/${leadCampaign.chapterSlug}/campaigns/${leadCampaign.slug}`} className="press inline-flex flex-col gap-1 border-2 border-ink bg-brand/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper">
              <span>Featured campaign</span>
              <span className="normal-case tracking-normal text-ink/50">What this chapter is fighting for</span>
            </Link>
          ) : null}
        </div>
      </section>
    </Shell>
  );
}
