import { Shell } from "@/components/shells";
import { PageHead, SectionHead, EventCard, JoinBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { getChapter, chapterLabel } from "@/lib/chapters";
import { chapters as mockChapters, campaigns as mockCampaigns, events as mockEvents, members as mockMembers } from "@/lib/mock";
import type { Campaign, EventItem } from "@/lib/mock";
import Link from "next/link";
import { ShareKit } from "@/components/ShareKit";
import { notFound } from "next/navigation";

type CommitteeMember = { name: string; role: string; email: string; id: string };
type SocialPost = { id: string; platform: string; url: string; caption: string };
type ZinePreview = { slug: string; title: string; excerpt: string; date: string };
type StatementPreview = { slug: string; title: string; content: string; date: string };
type ArticlePreview = { title: string; outlet: string; url: string; date: string };
type PodcastPreview = { slug: string; title: string; date: string };

const DIR = 27;

function getChapterData(slug: string) {
  return mockChapters.find((c) => c.slug === slug) ?? null;
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
    const rows = await readSheet("Users", { chapter_slug: slug, status: "active" });
    return rows.length || mockMembers.filter((m) => m.chapterSlug === slug).length;
  } catch {
    return mockMembers.filter((m) => m.chapterSlug === slug).length;
  }
}

async function getChapterLeadership(slug: string): Promise<CommitteeMember[]> {
  try {
    const rows = await readSheet("Committee", { chapter: slug });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id ?? r.name?.toLowerCase().replace(/\s+/g, "") ?? "",
        name: r.name ?? "",
        role: r.title ?? "",
        email: r.email ?? "",
      }));
    }
  } catch {
  }
  return mockMembers
    .filter((m) => m.chapterSlug === slug && m.role !== "Member")
    .map((m) => ({ id: m.name.toLowerCase().replace(/\s+/g, ""), name: m.name, role: m.role, email: "" }));
}

async function getChapterSocialPosts(slug: string): Promise<SocialPost[]> {
  try {
    const rows = await readSheet("Social", { chapter_slug: slug });
    return rows.slice(0, 4).map((r) => ({
      id: r.id ?? `social-${r.url}`,
      platform: (r.platform ?? "instagram").toLowerCase(),
      url: r.url ?? "#",
      caption: r.caption ?? "",
    }));
  } catch {
    return [];
  }
}

async function getChapterZines(slug: string): Promise<ZinePreview[]> {
  try {
    const rows = await readSheet("Zines", { chapter_slug: slug, status: "approved" });
    return rows.slice(0, 3).map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      excerpt: r.excerpt ?? (r.content ?? "").slice(0, 160),
      date: r.created_at ?? "",
    }));
  } catch {
    return [];
  }
}

async function getChapterStatements(slug: string): Promise<StatementPreview[]> {
  try {
    const rows = await readSheet("Statements", { chapter_slug: slug });
    return rows.slice(0, 3).map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      content: r.content ?? "",
      date: r.date ?? "",
    }));
  } catch {
    return [];
  }
}

async function getChapterArticles(slug: string): Promise<ArticlePreview[]> {
  try {
    const rows = await readSheet("News");
    return rows
      .filter((r) => !r.chapter_slug || r.chapter_slug === slug)
      .slice(0, 3)
      .map((r) => ({
        title: r.title ?? "",
        outlet: r.outlet ?? "",
        url: r.url ?? "#",
        date: r.fetched_at ?? "",
      }));
  } catch {
    return [];
  }
}

async function getChapterPodcasts(slug: string): Promise<PodcastPreview[]> {
  try {
    const rows = await readSheet("Podcasts" as Parameters<typeof readSheet>[0]);
    return rows
      .filter((r) => !r.chapter_slug || r.chapter_slug === slug)
      .slice(0, 3)
      .map((r) => ({
        slug: r.slug ?? "",
        title: r.title ?? "",
        date: r.date ?? "",
      }));
  } catch {
    return [];
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
  if (!ch) notFound();
  const meta = getChapter(slug)!;
  const [campaigns, events, memberCount, leadership, socialPosts, zines, statements, podcasts, articles] =
    await Promise.all([
      getChapterCampaigns(slug),
      getChapterEvents(slug),
      getChapterMemberCount(slug),
      getChapterLeadership(slug),
      getChapterSocialPosts(slug),
      getChapterZines(slug),
      getChapterStatements(slug),
      getChapterPodcasts(slug),
      getChapterArticles(slug),
    ]);

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Chapters" title={ch.name} sub={ch.tagline} />
      <StatsStrip memberCount={memberCount} campaignCount={campaigns.length} />
      {leadership.length > 0 ? (
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={0} title="Leadership" sub="The people leading this chapter." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((m) => (
                <Link key={m.id} href={`/member/${m.id}`} className="group border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{m.role}</p>
                  <h3 className="mt-2 display text-xl group-hover:text-brand transition-colors">{m.name}</h3>
                  {m.email ? <p className="mono mt-1 text-[12px] text-ink/40">{m.email}</p> : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section id="campaigns" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Campaigns" sub="What this chapter is fighting for right now." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.length > 0 ? (
              campaigns.slice(0, 3).map((c) => (
                <Link key={c.slug} href={`/chapters/${slug}/campaigns/${c.slug}`} className="group border border-line bg-cream p-6 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{chapterLabel(c.chapterSlug)}</p>
                  <h3 className="display mt-2 text-xl group-hover:text-brand transition-colors">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/70 line-clamp-3">{c.summary}</p>
                </Link>
              ))
            ) : (
              <p className="border border-dashed border-line bg-cream p-6 text-[14px] text-ink/60">No active campaigns yet.</p>
            )}
          </div>
          {campaigns.length > 0 ? (
            <div className="mt-6">
              <Link href={`/chapters/${slug}/campaigns`} className="mono text-[12px] uppercase tracking-[0.14em] text-ink/60 underline underline-offset-4 hover:text-brand transition-colors">
                View all campaigns
              </Link>
            </div>
          ) : null}
        </div>
      </section>
      <section id="events" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Upcoming events" sub={`Sessions for the ${meta.short} chapter.`} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.slice(0, 3).map((e) => <EventCard key={e.slug} e={e} />)
            ) : (
              <p className="border border-dashed border-line bg-cream p-6 text-[14px] text-ink/60">Nothing scheduled yet. Check back soon.</p>
            )}
          </div>
          {events.length > 0 ? (
            <div className="mt-6">
              <Link href={`/chapters/${slug}/events`} className="mono text-[12px] uppercase tracking-[0.14em] text-ink/60 underline underline-offset-4 hover:text-brand transition-colors">
                View all events
              </Link>
            </div>
          ) : null}
        </div>
      </section>
      {socialPosts.length > 0 ? (
        <section id="posts" className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={3} title="Social" sub="Latest from our social channels." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {socialPosts.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="group border border-line bg-cream p-4 hover:border-brand transition-colors">
                  <span className={`inline-flex border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                    p.platform === "instagram" ? "border-pink/40 bg-pink/10 text-pink" :
                    p.platform === "youtube" ? "border-brand/40 bg-brand/10 text-brand-text" :
                    "border-ink/40 bg-ink/10 text-ink"
                  }`}>{p.platform}</span>
                  <p className="mt-2 text-[14px] text-ink/70 line-clamp-2">{p.caption}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {zines.length > 0 ? (
        <section id="zines" className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={4} title="Zines" sub="Print-ready zines from this chapter." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {zines.map((z) => (
                <Link key={z.slug} href="/media" className="group border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{z.date}</p>
                  <h3 className="display mt-2 text-lg group-hover:text-brand transition-colors">{z.title}</h3>
                  <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{z.excerpt}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/media" className="mono text-[12px] uppercase tracking-[0.14em] text-ink/60 underline underline-offset-4 hover:text-brand transition-colors">
                View all on Media
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      {statements.length > 0 ? (
        <section id="statements" className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={5} title="Statements" sub="Official positions from this chapter." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statements.map((s) => (
                <Link key={s.slug} href={`/chapters/${slug}/statements/${s.slug}`} className="group border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{s.date}</p>
                  <h3 className="display mt-2 text-lg group-hover:text-brand transition-colors">{s.title}</h3>
                  <p className="mt-2 text-[13px] text-ink/60 line-clamp-3">{s.content.slice(0, 160)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section id="podcasts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={6} title="Podcasts" sub="Conversations from the movement." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {podcasts.length > 0 ? (
              podcasts.map((p) => (
                <div key={p.slug} className="border border-line bg-cream p-5">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{p.date}</p>
                  <h3 className="display mt-2 text-lg">{p.title}</h3>
                </div>
              ))
            ) : (
              <p className="border border-dashed border-line bg-cream p-6 text-[14px] text-ink/60">Coming soon.</p>
            )}
          </div>
        </div>
      </section>
      {articles.length > 0 ? (
        <section id="articles" className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={7} title="In the news" sub="Press coverage featuring this chapter." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <a key={a.url} href={a.url} target="_blank" rel="noreferrer" className="group border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{a.outlet}</p>
                  <h3 className="display mt-2 text-lg group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="mono mt-2 text-[11px] uppercase tracking-[0.14em] text-ink/40">{a.date}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-10 sm:px-6">
          <span className="mono mr-1 text-[11px] uppercase tracking-[0.2em] text-ink/50">Jump to</span>
          <Link href={`/chapters/${slug}/campaigns`} className="press inline-flex flex-col gap-1 border-2 border-ink bg-brand/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper">
            <span>Campaigns</span>
            <span className="normal-case tracking-normal text-ink/50">All campaigns</span>
          </Link>
          <Link href={`/chapters/${slug}/events`} className="press inline-flex flex-col gap-1 border-2 border-ink bg-brand/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper">
            <span>Events</span>
            <span className="normal-case tracking-normal text-ink/50">All events</span>
          </Link>
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <ShareKit title={`${ch.name} - Liga Mahasiswa`} url={`https://ligamahasiswa.vercel.app/chapters/${slug}`} />
        </div>
      </section>
      <JoinBand />
    </Shell>
  );
}
