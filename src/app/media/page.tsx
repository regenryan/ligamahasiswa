import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { chapterLabel, CHAPTERS } from "@/lib/chapters";
import { readSheet } from "@/lib/sheets-db";
import { SkeletonGrid } from "@/components/skeleton";
import Link from "next/link";

const DIR = 27;
const PREVIEW = 6;

type Post = { id: string; platform: string; caption: string; url: string; chapter: string };
type Zine = { slug: string; title: string; excerpt: string; author: string; chapter: string };
type Statement = { slug: string; title: string; preview: string; chapter: string };
type Podcast = { slug: string; title: string; date: string; chapter: string };
type Article = { title: string; outlet: string; url: string; chapter: string };

async function getPosts(): Promise<Post[]> {
  try {
    const rows = await readSheet("Social");
    return rows.map((r) => ({
      id: r.id ?? `social-${r.url}`,
      platform: (r.platform ?? "instagram").toLowerCase(),
      caption: r.caption ?? "",
      url: r.url ?? "#",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getZines(): Promise<Zine[]> {
  try {
    const rows = await readSheet("Zines", { status: "approved" });
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      excerpt: r.excerpt ?? (r.content ?? "").slice(0, 160),
      author: r.author ?? "",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getStatements(): Promise<Statement[]> {
  try {
    const rows = await readSheet("Statements");
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      preview: (r.content ?? "").slice(0, 160),
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getPodcasts(): Promise<Podcast[]> {
  try {
    const rows = await readSheet("Podcasts" as Parameters<typeof readSheet>[0]);
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      date: r.date ?? "",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

async function getArticles(): Promise<Article[]> {
  try {
    const rows = await readSheet("News");
    return rows.map((r) => ({
      title: r.title ?? "",
      outlet: r.outlet ?? "",
      url: r.url ?? "#",
      chapter: r.chapter_slug ?? "ligamy",
    }));
  } catch {
    return [];
  }
}

const PLATFORM_SKIN: Record<string, string> = {
  instagram: "border-pink/40 bg-pink/10 text-pink",
  youtube: "border-brand/40 bg-brand/10 text-brand-text",
  twitter: "border-ink/40 bg-ink/10 text-ink",
  x: "border-ink/40 bg-ink/10 text-ink",
};

const CARD = "border border-line bg-cream p-5 hover:border-brand transition-colors";
const BADGE = "inline-block border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em]";
const TAG = `${BADGE} border-line text-ink/60`;
const FILTER_BTN =
  "press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors";
const VIEW_ALL =
  "press inline-block border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors";

function FilterBar({ section, active }: { section: string; active?: string }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href="/media"
        className={`${FILTER_BTN} ${!active ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
      >
        All
      </Link>
      {CHAPTERS.map((c) => (
        <Link
          key={c.slug}
          href={`/media?${section}=${c.slug}`}
          className={`${FILTER_BTN} ${active === c.slug ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
        >
          {c.short}
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 border border-dashed border-line p-8 text-center">
      <p className="text-[14px] text-ink/50">{message}</p>
    </div>
  );
}

function viewAllHref(section: string, chapter?: string): string {
  const qs = new URLSearchParams();
  if (chapter) qs.set(section, chapter);
  qs.set("view", section);
  return `/media?${qs.toString()}`;
}

async function PostsSection({
  chapterFilter,
  expanded,
}: {
  chapterFilter?: string;
  expanded?: boolean;
}) {
  const posts = await getPosts();
  const shown = chapterFilter ? posts.filter((p) => p.chapter === chapterFilter) : posts;
  const cards = expanded ? shown : shown.slice(0, PREVIEW);
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className={CARD}>
            <span className={`${BADGE} ${PLATFORM_SKIN[p.platform] ?? "border-line text-ink/60"}`}>
              {p.platform}
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/70 line-clamp-3">
              {p.caption || "View post"}
            </p>
          </a>
        ))}
      </div>
      {!expanded && shown.length > PREVIEW && (
        <div className="mt-8">
          <Link href={viewAllHref("posts", chapterFilter)} className={VIEW_ALL}>
            View all {shown.length}
          </Link>
        </div>
      )}
      {shown.length === 0 && <EmptyState message="No posts yet." />}
    </>
  );
}

async function ZinesSection({
  chapterFilter,
  expanded,
}: {
  chapterFilter?: string;
  expanded?: boolean;
}) {
  const zines = await getZines();
  const shown = chapterFilter ? zines.filter((z) => z.chapter === chapterFilter) : zines;
  const cards = expanded ? shown : shown.slice(0, PREVIEW);
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((z) => (
          <Link key={z.slug} href="/media" className={CARD}>
            <span className={TAG}>{chapterLabel(z.chapter)}</span>
            <h3 className="mt-3 display text-xl">{z.title}</h3>
            <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{z.excerpt}</p>
            {z.author ? (
              <p className="mono mt-3 truncate text-[11px] uppercase tracking-[0.14em] text-ink/40">
                {z.author}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
      {!expanded && shown.length > PREVIEW && (
        <div className="mt-8">
          <Link href={viewAllHref("zines", chapterFilter)} className={VIEW_ALL}>
            View all {shown.length}
          </Link>
        </div>
      )}
      {shown.length === 0 && <EmptyState message="No zines yet." />}
    </>
  );
}

async function StatementsSection({
  chapterFilter,
  expanded,
}: {
  chapterFilter?: string;
  expanded?: boolean;
}) {
  const statements = await getStatements();
  const shown = chapterFilter ? statements.filter((s) => s.chapter === chapterFilter) : statements;
  const cards = expanded ? shown : shown.slice(0, PREVIEW);
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((s) => (
          <Link
            key={s.slug}
            href={`/chapters/${s.chapter}/statements/${s.slug}`}
            className={CARD}
          >
            <span className={TAG}>{chapterLabel(s.chapter)}</span>
            <h3 className="mt-3 display text-xl">{s.title}</h3>
            <p className="mt-2 text-[13px] text-ink/60 line-clamp-3">{s.preview}</p>
          </Link>
        ))}
      </div>
      {!expanded && shown.length > PREVIEW && (
        <div className="mt-8">
          <Link href={viewAllHref("statements", chapterFilter)} className={VIEW_ALL}>
            View all {shown.length}
          </Link>
        </div>
      )}
      {shown.length === 0 && <EmptyState message="No statements yet." />}
    </>
  );
}

async function PodcastsSection({
  chapterFilter,
  expanded,
}: {
  chapterFilter?: string;
  expanded?: boolean;
}) {
  const podcasts = await getPodcasts();
  const shown = chapterFilter ? podcasts.filter((p) => p.chapter === chapterFilter) : podcasts;
  const cards = expanded ? shown : shown.slice(0, PREVIEW);
  return (
    <>
      {cards.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => (
            <div key={p.slug} className={CARD}>
              <div className="flex items-center justify-between gap-3">
                <span className={TAG}>{chapterLabel(p.chapter)}</span>
                {p.date ? (
                  <span className="mono truncate text-[11px] tracking-[0.08em] text-ink/40">
                    {p.date}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 display text-xl">{p.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Coming soon." />
      )}
      {!expanded && shown.length > PREVIEW && (
        <div className="mt-8">
          <Link href={viewAllHref("podcasts", chapterFilter)} className={VIEW_ALL}>
            View all {shown.length}
          </Link>
        </div>
      )}
    </>
  );
}

async function ArticlesSection({
  chapterFilter,
  expanded,
}: {
  chapterFilter?: string;
  expanded?: boolean;
}) {
  const articles = await getArticles();
  const shown = chapterFilter ? articles.filter((a) => a.chapter === chapterFilter) : articles;
  const cards = expanded ? shown : shown.slice(0, PREVIEW);
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((a) => (
          <a key={`${a.url}-${a.title}`} href={a.url} target="_blank" rel="noreferrer" className={CARD}>
            <div className="flex items-center justify-between gap-3">
              <span className="mono truncate text-[11px] uppercase tracking-[0.14em] text-ink/50">
                {a.outlet}
              </span>
              <span className={TAG}>{chapterLabel(a.chapter)}</span>
            </div>
            <h3 className="mt-3 display text-xl">{a.title}</h3>
          </a>
        ))}
      </div>
      {!expanded && shown.length > PREVIEW && (
        <div className="mt-8">
          <Link href={viewAllHref("articles", chapterFilter)} className={VIEW_ALL}>
            View all {shown.length}
          </Link>
        </div>
      )}
      {shown.length === 0 && <EmptyState message="No coverage yet." />}
    </>
  );
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const validSlugs = new Set<string>(CHAPTERS.map((c) => c.slug as string));
  const pick = (key: string) => {
    const v = first(raw[key]);
    return v && validSlugs.has(v) ? v : undefined;
  };

  const views = new Set((first(raw.view) ?? "").split(",").filter(Boolean));

  const postsFilter = pick("posts");
  const zinesFilter = pick("zines");
  const statementsFilter = pick("statements");
  const podcastsFilter = pick("podcasts");
  const articlesFilter = pick("articles");

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Media"
        title="Media"
        sub="Stories, coverage, and voices from the movement."
      />

      <section id="posts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Social posts" sub="Fresh from our social channels." />
          <FilterBar section="posts" active={postsFilter} />
          <Suspense fallback={<SkeletonGrid />}>
            <PostsSection chapterFilter={postsFilter} expanded={views.has("posts")} />
          </Suspense>
        </div>
      </section>

      <section id="zines" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Zines" sub="Art and writing from the movement." />
          <FilterBar section="zines" active={zinesFilter} />
          <Suspense fallback={<SkeletonGrid />}>
            <ZinesSection chapterFilter={zinesFilter} expanded={views.has("zines")} />
          </Suspense>
        </div>
      </section>

      <section id="statements" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={3} title="Statements" sub="Official positions, on the record." />
          <FilterBar section="statements" active={statementsFilter} />
          <Suspense fallback={<SkeletonGrid />}>
            <StatementsSection chapterFilter={statementsFilter} expanded={views.has("statements")} />
          </Suspense>
        </div>
      </section>

      <section id="podcasts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={4} title="Podcasts" sub="Conversations with the movement." />
          <FilterBar section="podcasts" active={podcastsFilter} />
          <Suspense fallback={<SkeletonGrid />}>
            <PodcastsSection chapterFilter={podcastsFilter} expanded={views.has("podcasts")} />
          </Suspense>
        </div>
      </section>

      <section id="articles" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={5} title="News articles" sub="Coverage in the press." />
          <FilterBar section="articles" active={articlesFilter} />
          <Suspense fallback={<SkeletonGrid />}>
            <ArticlesSection chapterFilter={articlesFilter} expanded={views.has("articles")} />
          </Suspense>
        </div>
      </section>

      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
