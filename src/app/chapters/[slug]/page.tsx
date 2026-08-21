"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Shell } from "@/components/shells";
import {
  CampaignSection,
  JoinBand,
  NewsletterBand,
  PageHead,
  SectionHead,
  EventCard,
} from "@/components/sections";
import { FilterPills, Reveal } from "@/components/interactive";
import { Placeholder } from "@/components/Placeholder";
import {
  campaigns as allCampaigns,
  events as allEvents,
  getChapter,
  members as allMembers,
  type EventItem,
} from "@/lib/mock";

const DIR = 27;

const GALLERY_CAPTIONS = [
  "IG post: chapter event, crowd shot",
  "IG post: campus assembly action",
  "IG post: friends holding a banner",
];

type EventFilter = "All" | EventItem["type"];
const EVENT_FILTERS: EventFilter[] = ["All", "Forum", "Assembly", "Dialogue"];

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
              <p className="display text-3xl leading-none sm:text-4xl">
                {s.value}
              </p>
              <p className="mono mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip({
  ig,
  short,
}: {
  ig: string;
  short: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={3}
            title="From our feed"
            sub={`We are the ${short} chapter. Movement, campaigns, and new friends. Start with a campaign, then come to an event.`}
          />
        </Reveal>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {GALLERY_CAPTIONS.map((c, i) => (
            <Reveal key={c} delay={i * 60}>
              <Placeholder
                ratio="1/1"
                caption={c}
                className="w-full border-2 border-ink"
              />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="mono text-center text-[11px] uppercase tracking-[0.16em] text-ink/50">
            Feed from {ig}. Mock placeholders, live sync soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function EventsSection({
  events,
  short,
}: {
  events: EventItem[];
  short: string;
}) {
  const [filter, setFilter] = useState<EventFilter>("All");
  const shown =
    filter === "All" ? events : events.filter((e) => e.type === filter);
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={4}
            title="Upcoming events"
            sub={`Sessions for the ${short} chapter. Open to members and non-members alike.`}
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills
            label="Filter by type"
            options={EVENT_FILTERS}
            value={filter}
            onChange={setFilter}
          />
        </Reveal>
        {shown.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 3) * 60}>
                <EventCard e={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="border border-line bg-cream p-6 text-[14px] text-ink/60">
            Nothing scheduled under this type yet. Check back after the next
            assembly.
          </p>
        )}
      </div>
    </section>
  );
}

function QuickLinks({
  teamHref,
  campaignHref,
}: {
  teamHref: string;
  campaignHref: string;
}) {
  const links = [
    {
      href: teamHref,
      label: "Meet the team",
      hint: "The people behind the chapter",
    },
    {
      href: campaignHref,
      label: "Featured campaign",
      hint: "What this chapter is fighting for",
    },
  ];
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono mr-1 text-[11px] uppercase tracking-[0.2em] text-ink/50">
            Jump to
          </span>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="press inline-flex flex-col gap-1 border-2 border-ink bg-brand/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper"
            >
              <span>{l.label}</span>
              <span className="normal-case tracking-normal text-ink/50">
                {l.hint}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterInner() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const ch = getChapter(slug);
  const chapterCampaigns = allCampaigns.filter(
    (c) => c.chapterSlug === slug,
  );
  const featured =
    slug === "malaysia"
      ? allCampaigns.filter((c) => c.chapterSlug === "malaysia")
      : chapterCampaigns.length > 0
        ? chapterCampaigns
        : allCampaigns.filter((c) => c.chapterSlug === "malaysia").slice(0, 2);
  const leadCampaign = featured[0] ?? allCampaigns[0];
  const memberCount =
    slug === "malaysia"
      ? allMembers.length
      : allMembers.filter((m) => m.chapterSlug === slug).length;
  const chapterEvents = allEvents.filter((e) => e.chapterSlug === slug);
  const shownEvents = chapterEvents.length > 0 ? chapterEvents : allEvents;
  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Chapters"
        title={ch.name}
        sub={ch.tagline}
      />
      <StatsStrip
        memberCount={memberCount}
        campaignCount={featured.length}
      />
      <CampaignSection
        items={featured}
        headline="Campaigns"
        sub="What this chapter is fighting for right now. Read the demands, then get in."
      />
      <GalleryStrip ig={ch.ig} short={ch.short} />
      <EventsSection events={shownEvents} short={ch.short} />
      <QuickLinks
        teamHref={`/chapters/${slug}/team`}
        campaignHref={`/chapters/${leadCampaign.chapterSlug}/campaigns/${leadCampaign.slug}`}
      />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}

export default function ChapterPage() {
  return (
    <Suspense fallback={null}>
      <ChapterInner />
    </Suspense>
  );
}
