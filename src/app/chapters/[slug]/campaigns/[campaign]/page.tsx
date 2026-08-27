import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { dbGetCampaignBySlug } from "@/lib/queries";
import type { CampaignData } from "@/lib/queries";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";
import { ShareKit } from "@/components/ShareKit";
import { SkeletonDetail, SkeletonMediaGrid } from "@/components/skeleton";

const DIR = 27;

async function getCampaign(campaignSlug: string): Promise<CampaignData | null> {
  return dbGetCampaignBySlug(campaignSlug);
}

type Post = { id: string; platform: string; caption: string; url: string };
type Zine = { slug: string; title: string; excerpt: string };
type Statement = { slug: string; title: string; preview: string };
type Podcast = { slug: string; title: string; date: string };
type Article = { title: string; outlet: string; url: string };

async function getPosts(chapterSlug: string): Promise<Post[]> {
  return [];
}

async function getZines(chapterSlug: string): Promise<Zine[]> {
  return [];
}

async function getStatements(chapterSlug: string): Promise<Statement[]> {
  return [];
}

async function getPodcasts(chapterSlug: string): Promise<Podcast[]> {
  return [];
}

async function getArticles(chapterSlug: string): Promise<Article[]> {
  return [];
}

const CARD = "border border-line bg-cream p-5 hover:border-brand transition-colors";
const BADGE =
  "inline-block border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em]";
const TAG = `${BADGE} border-line text-ink/60`;
const PLATFORM_SKIN: Record<string, string> = {
  instagram: "border-pink/40 bg-pink/10 text-pink",
  youtube: "border-brand/40 bg-brand/10 text-brand-text",
  twitter: "border-ink/40 bg-ink/10 text-ink",
  x: "border-ink/40 bg-ink/10 text-ink",
};

function MediaGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 border border-dashed border-line p-8 text-center">
      <p className="text-[14px] text-ink/50">{message}</p>
    </div>
  );
}

async function CampaignContent({
  slug,
  campaignSlug,
  typeFilter,
}: {
  slug: string;
  campaignSlug: string;
  typeFilter?: string;
}) {
  const campaign = await getCampaign(campaignSlug);

  if (!campaign) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-[14px] text-ink/60">Campaign not found.</p>
        <Link
          href={`/chapters/${slug}/campaigns`}
          className="mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
        >
          {"\u2190"} Back to campaigns
        </Link>
      </div>
    );
  }

  const show = (t: string) => !typeFilter || typeFilter === t;

  const VALID_TYPES = ["posts", "zines", "statements", "podcasts", "articles"] as const;

  return (
    <>
      <PageHead kicker={chapterLabel(slug)} title={campaign.name} sub={campaign.summary} />

      <section id="introduction" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Overview" />
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            {campaign.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className={`${BADGE} border-brand/40 bg-brand/10 text-brand-text`}>
              Active
            </span>
            <span className={TAG}>{chapterLabel(slug)}</span>
          </div>
        </div>
      </section>

      <section id="demands" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Key demands" />
          {campaign.demands.length > 0 ? (
            <ol className="space-y-3">
              {campaign.demands.map((d, i) => (
                <li key={i} className="flex items-start gap-4 border border-line bg-cream p-5">
                  <span className="mt-2 shrink-0 text-[14px] text-ink/50">{i + 1}.</span>
                  <span className="text-[15px] leading-relaxed text-ink/80">{d}</span>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState message="No demands published yet." />
          )}
        </div>
      </section>

      <section id="memorandum" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={3} title="Memorandum" />
          {campaign.memorandum ? (
            <div className="prose max-w-none text-[15px] leading-relaxed text-ink/70">
              {campaign.memorandum.split("\n").map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <EmptyState message="The memorandum for this campaign has not been published yet." />
          )}
        </div>
      </section>

      <Suspense fallback={
        <section id="media" className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <SectionHead index={4} title="Related media" sub="Coverage and artifacts from this chapter." />
            <SkeletonMediaGrid />
          </div>
        </section>
      }>
        <CampaignMedia
          slug={slug}
          campaignSlug={campaignSlug}
          chapterSlug={campaign.chapterSlug}
          show={show}
        />
      </Suspense>

      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 border border-fog/20 bg-fog/5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[15px] font-bold text-fog">Support this campaign</p>
              <p className="mono mt-1 text-[12px] text-fog/60">Every contribution helps fund our work.</p>
            </div>
            <Link
              href={`/chapters/${slug}/campaigns/${campaignSlug}/fundraise`}
              className="press inline-flex border-2 border-fog bg-fog/10 px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog hover:bg-fog/20 transition-colors"
            >
              Fundraise
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <ShareKit
            title={campaign.name}
            url={`https://ligamahasiswa.vercel.app/chapters/${slug}/campaigns/${campaignSlug}`}
          />
        </div>
      </section>
    </>
  );
}

async function CampaignMedia({
  slug,
  campaignSlug,
  chapterSlug,
  show,
}: {
  slug: string;
  campaignSlug: string;
  chapterSlug: string;
  show: (t: string) => boolean;
}) {
  const VALID_TYPES = ["posts", "zines", "statements", "podcasts", "articles"] as const;

  const typeLinks = (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href={`/chapters/${slug}/campaigns/${campaignSlug}`}
        className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${!show("all") ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
      >
        All
      </Link>
      {VALID_TYPES.map((t) => (
        <Link
          key={t}
          href={`/chapters/${slug}/campaigns/${campaignSlug}?type=${t}`}
          className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${show(t) && show("all") === false ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
        >
          {t}
        </Link>
      ))}
    </div>
  );

  const [posts, zines, statements, podcasts, articles] = await Promise.all([
    getPosts(chapterSlug),
    getZines(chapterSlug),
    getStatements(chapterSlug),
    getPodcasts(chapterSlug),
    getArticles(chapterSlug),
  ]);

  return (
    <section id="media" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead index={4} title="Related media" sub="Coverage and artifacts from this chapter." />
        {typeLinks}

        {show("posts") && (
          <div className="mt-10">
            <h3 className="mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Posts
            </h3>
            {posts.length > 0 ? (
              <MediaGrid>
                {posts.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className={CARD}
                  >
                    <span className={`${BADGE} ${PLATFORM_SKIN[p.platform] ?? "border-line text-ink/60"}`}>
                      {p.platform}
                    </span>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink/70 line-clamp-3">
                      {p.caption || "View post"}
                    </p>
                  </a>
                ))}
              </MediaGrid>
            ) : (
              <EmptyState message="No posts yet." />
            )}
          </div>
        )}

        {show("zines") && (
          <div className="mt-10">
            <h3 className="mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Zines
            </h3>
            {zines.length > 0 ? (
              <MediaGrid>
                {zines.map((z) => (
                  <Link key={z.slug} href="/media" className={CARD}>
                    <h4 className="display text-xl">{z.title}</h4>
                    <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{z.excerpt}</p>
                  </Link>
                ))}
              </MediaGrid>
            ) : (
              <EmptyState message="No zines yet." />
            )}
          </div>
        )}

        {show("statements") && (
          <div className="mt-10">
            <h3 className="mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Statements
            </h3>
            {statements.length > 0 ? (
              <MediaGrid>
                {statements.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/chapters/${chapterSlug}/statements/${s.slug}`}
                    className={CARD}
                  >
                    <h4 className="display text-xl">{s.title}</h4>
                    <p className="mt-2 text-[13px] text-ink/60 line-clamp-3">{s.preview}</p>
                  </Link>
                ))}
              </MediaGrid>
            ) : (
              <EmptyState message="No statements yet." />
            )}
          </div>
        )}

        {show("podcasts") && (
          <div className="mt-10">
            <h3 className="mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Podcasts
            </h3>
            {podcasts.length > 0 ? (
              <MediaGrid>
                {podcasts.map((p) => (
                  <div key={p.slug} className={CARD}>
                    <div className="flex items-center justify-between gap-3">
                      <span className={TAG}>{chapterLabel(chapterSlug)}</span>
                      {p.date ? (
                        <span className="mono truncate text-[11px] tracking-[0.08em] text-ink/40">
                          {p.date}
                        </span>
                      ) : null}
                    </div>
                    <h4 className="mt-3 display text-xl">{p.title}</h4>
                  </div>
                ))}
              </MediaGrid>
            ) : (
              <EmptyState message="Coming soon." />
            )}
          </div>
        )}

        {show("articles") && (
          <div className="mt-10">
            <h3 className="mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink/50">
              Articles
            </h3>
            {articles.length > 0 ? (
              <MediaGrid>
                {articles.map((a) => (
                  <a
                    key={`${a.url}-${a.title}`}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className={CARD}
                  >
                    <span className="mono truncate text-[11px] uppercase tracking-[0.14em] text-ink/50">
                      {a.outlet}
                    </span>
                    <h4 className="mt-3 display text-xl">{a.title}</h4>
                  </a>
                ))}
              </MediaGrid>
            ) : (
              <EmptyState message="No coverage yet." />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; campaign: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug, campaign: campaignSlug } = await params;
  const raw = await searchParams;
  const typeRaw = Array.isArray(raw.type) ? raw.type[0] : raw.type;
  const VALID_TYPES = ["posts", "zines", "statements", "podcasts", "articles"] as const;
  const typeFilter = VALID_TYPES.find((t) => t === typeRaw);

  return (
    <Shell dir={DIR}>
      <Suspense fallback={<SkeletonDetail />}>
        <CampaignContent
          slug={slug}
          campaignSlug={campaignSlug}
          typeFilter={typeFilter}
        />
      </Suspense>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
