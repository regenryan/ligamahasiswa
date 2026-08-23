import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { chapterLabel, CHAPTERS } from "@/lib/chapters";
import { readSheet } from "@/lib/sheets-db";
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

  const [posts, zines, statements, podcasts, articles] = await Promise.all([
    getPosts(),
    getZines(),
    getStatements(),
    getPodcasts(),
    getArticles(),
  ]);

  const views = new Set((first(raw.view) ?? "").split(",").filter(Boolean));

  const postsFilter = pick("posts");
  const zinesFilter = pick("zines");
  const statementsFilter = pick("statements");
  const podcastsFilter = pick("podcasts");
  const articlesFilter = pick("articles");

  const shownPosts = postsFilter ? posts.filter((p) => p.chapter === postsFilter) : posts;
  const shownZines = zinesFilter ? zines.filter((z) => z.chapter === zinesFilter) : zines;
  const shownStatements = statementsFilter
    ? statements.filter((s) => s.chapter === statementsFilter)
    : statements;
  const shownPodcasts = podcastsFilter
    ? podcasts.filter((p) => p.chapter === podcastsFilter)
    : podcasts;
  const shownArticles = articlesFilter
    ? articles.filter((a) => a.chapter === articlesFilter)
    : articles;

  const postCards = views.has("posts") ? shownPosts : shownPosts.slice(0, PREVIEW);
  const zineCards = views.has("zines") ? shownZines : shownZines.slice(0, PREVIEW);
  const statementCards = views.has("statements") ? shownStatements : shownStatements.slice(0, PREVIEW);
  const podcastCards = views.has("podcasts") ? shownPodcasts : shownPodcasts.slice(0, PREVIEW);
  const articleCards = views.has("articles") ? shownArticles : shownArticles.slice(0, PREVIEW);

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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {postCards.map((p) => (
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
          {!views.has("posts") && shownPosts.length > PREVIEW && (
            <div className="mt-8">
              <Link href={viewAllHref("posts", postsFilter)} className={VIEW_ALL}>
                View all {shownPosts.length}
              </Link>
            </div>
          )}
          {shownPosts.length === 0 && <EmptyState message="No posts yet." />}
        </div>
      </section>

      <section id="zines" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Zines" sub="Art and writing from the movement." />
          <FilterBar section="zines" active={zinesFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zineCards.map((z) => (
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
          {!views.has("zines") && shownZines.length > PREVIEW && (
            <div className="mt-8">
              <Link href={viewAllHref("zines", zinesFilter)} className={VIEW_ALL}>
                View all {shownZines.length}
              </Link>
            </div>
          )}
          {shownZines.length === 0 && <EmptyState message="No zines yet." />}
        </div>
      </section>

      <section id="statements" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={3} title="Statements" sub="Official positions, on the record." />
          <FilterBar section="statements" active={statementsFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statementCards.map((s) => (
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
          {!views.has("statements") && shownStatements.length > PREVIEW && (
            <div className="mt-8">
              <Link href={viewAllHref("statements", statementsFilter)} className={VIEW_ALL}>
                View all {shownStatements.length}
              </Link>
            </div>
          )}
          {shownStatements.length === 0 && <EmptyState message="No statements yet." />}
        </div>
      </section>

      <section id="podcasts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={4} title="Podcasts" sub="Conversations with the movement." />
          <FilterBar section="podcasts" active={podcastsFilter} />
          {podcastCards.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {podcastCards.map((p) => (
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
          {!views.has("podcasts") && shownPodcasts.length > PREVIEW && (
            <div className="mt-8">
              <Link href={viewAllHref("podcasts", podcastsFilter)} className={VIEW_ALL}>
                View all {shownPodcasts.length}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="articles" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={5} title="News articles" sub="Coverage in the press." />
          <FilterBar section="articles" active={articlesFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articleCards.map((a) => (
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
          {!views.has("articles") && shownArticles.length > PREVIEW && (
            <div className="mt-8">
              <Link href={viewAllHref("articles", articlesFilter)} className={VIEW_ALL}>
                View all {shownArticles.length}
              </Link>
            </div>
          )}
          {shownArticles.length === 0 && <EmptyState message="No coverage yet." />}
        </div>
      </section>

      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
