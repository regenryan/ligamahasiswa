import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead, EventCard, JoinBand } from "@/components/sections";
import { getChapterSync, getChapter, CHAPTERS } from "@/lib/chapters";
import { dbGetCampaignsByChapter, dbGetEventsByChapter, dbGetUserCount } from "@/lib/queries";
import type { CampaignData, EventData } from "@/lib/queries";
import Link from "next/link";
import { ShareKit } from "@/components/ShareKit";
import { notFound } from "next/navigation";
import { SkeletonGrid, SkeletonSectionHead, SkeletonStats } from "@/components/skeleton";

type SocialPost = { id: string; platform: string; url: string; caption: string };
type ZinePreview = { slug: string; title: string; excerpt: string; date: string };
type StatementPreview = { slug: string; title: string; content: string; date: string };
type ArticlePreview = { title: string; outlet: string; url: string; date: string };
type PodcastPreview = { slug: string; title: string; date: string };

const DIR = 27;

function getChapterData(slug: string) {
  return CHAPTERS.find((c) => c.slug === slug) ?? null;
}

async function getChapterCampaigns(slug: string): Promise<CampaignData[]> {
  const chapter = await getChapter(slug);
  if (!chapter) return [];
  return dbGetCampaignsByChapter(chapter.chapterId);
}

async function getChapterEvents(slug: string): Promise<EventData[]> {
  const chapter = await getChapter(slug);
  if (!chapter) return [];
  return dbGetEventsByChapter(chapter.chapterId);
}

async function getChapterMemberCount(slug: string): Promise<number> {
  return dbGetUserCount();
}

async function getChapterSocialPosts(slug: string): Promise<SocialPost[]> {
  return [];
}

async function getChapterZines(slug: string): Promise<ZinePreview[]> {
  return [];
}

async function getChapterStatements(slug: string): Promise<StatementPreview[]> {
  return [];
}

async function getChapterArticles(slug: string): Promise<ArticlePreview[]> {
  return [];
}

async function getChapterPodcasts(slug: string): Promise<PodcastPreview[]> {
  return [];
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

async function ChapterStats({ slug }: { slug: string }) {
  const [memberCount, campaigns] = await Promise.all([
    getChapterMemberCount(slug),
    getChapterCampaigns(slug),
  ]);
  return <StatsStrip memberCount={memberCount} campaignCount={campaigns.length} />;
}

async function ChapterLeadership({ slug }: { slug: string }) {
  return null;
}

async function ChapterCampaigns({ slug, chapterShort }: { slug: string; chapterShort: string }) {
  const campaigns = await getChapterCampaigns(slug);
  return (
    <section id="campaigns" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead index={1} title="Campaigns" sub="What this chapter is fighting for right now." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length > 0 ? (
            campaigns.slice(0, 3).map((c) => (
              <Link key={c.slug} href={`/chapters/${slug}/campaigns/${c.slug}`} className="group border border-line bg-cream p-6 hover:border-brand transition-colors">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{chapterShort}</p>
                <h3 className="display mt-2 text-xl group-hover:text-brand transition-colors">{c.name}</h3>
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
  );
}

async function ChapterEvents({ slug, chapterShort }: { slug: string; chapterShort: string }) {
  const events = await getChapterEvents(slug);
  return (
    <section id="events" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead index={2} title="Upcoming events" sub={`Sessions for the ${chapterShort} chapter.`} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.slice(0, 3).map((e) => <EventCard key={e.slug} e={{ ...e, title: e.name, place: e.location, blurb: e.description, type: (e.type || "Forum") as "Forum" | "Assembly" | "Dialogue" }} />)
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
  );
}

async function ChapterMedia({ slug }: { slug: string }) {
  const [socialPosts, zines, statements, podcasts, articles] = await Promise.all([
    getChapterSocialPosts(slug),
    getChapterZines(slug),
    getChapterStatements(slug),
    getChapterPodcasts(slug),
    getChapterArticles(slug),
  ]);
  return (
    <>
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
    </>
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = getChapterSync(slug);
  if (!ch) notFound();
  const meta = ch;

  const sectionFallback = (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6">
        <SkeletonSectionHead />
      </div>
      <SkeletonGrid />
    </section>
  );

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Chapters" title={ch.label} sub={ch.tagline} />
      <Suspense
        fallback={
          <section className="border-b border-line">
            <SkeletonStats />
          </section>
        }
      >
        <ChapterStats slug={slug} />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <ChapterLeadership slug={slug} />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <ChapterCampaigns slug={slug} chapterShort={meta.short} />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <ChapterEvents slug={slug} chapterShort={meta.short} />
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <ChapterMedia slug={slug} />
      </Suspense>
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
          <ShareKit title={`${ch.label} - Liga Mahasiswa`} url={`https://ligamahasiswa.vercel.app/chapters/${slug}`} />
        </div>
      </section>
      <JoinBand />
    </Shell>
  );
}
