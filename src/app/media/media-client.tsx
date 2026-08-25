"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { CHAPTERS, chapterLabel } from "@/lib/chapters";

type Post = { id: string; platform: string; caption: string; url: string; chapter: string };
type Zine = { slug: string; title: string; excerpt: string; author: string; chapter: string };
type Statement = { slug: string; title: string; preview: string; chapter: string };
type Podcast = { slug: string; title: string; date: string; chapter: string };
type Article = { title: string; outlet: string; url: string; chapter: string };

type MediaData = {
  posts: Post[];
  zines: Zine[];
  statements: Statement[];
  podcasts: Podcast[];
  articles: Article[];
};

const FILTER_BTN =
  "press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors";
const CARD = "border border-line bg-cream p-5 hover:border-brand transition-colors";
const BADGE = "inline-block border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em]";
const TAG = `${BADGE} border-line text-ink/60`;

const PLATFORM_SKIN: Record<string, string> = {
  instagram: "border-pink/40 bg-pink/10 text-pink",
  youtube: "border-brand/40 bg-brand/10 text-brand-text",
  twitter: "border-ink/40 bg-ink/10 text-ink",
  x: "border-ink/40 bg-ink/10 text-ink",
};

const VIEW_ALL =
  "press inline-block border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors";

function FilterBar({ section, active, onChange }: { section: string; active?: string; onChange: (slug: string) => void }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`${FILTER_BTN} ${!active ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
      >
        All
      </button>
      {CHAPTERS.map((c) => (
        <button
          key={c.slug}
          onClick={() => onChange(c.slug)}
          className={`${FILTER_BTN} ${active === c.slug ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
        >
          {c.short}
        </button>
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

const PREVIEW = 6;

export function MediaClient({ data }: { data: MediaData }) {
  const [postsFilter, setPostsFilter] = useState("");
  const [zinesFilter, setZinesFilter] = useState("");
  const [statementsFilter, setStatementsFilter] = useState("");
  const [podcastsFilter, setPodcastsFilter] = useState("");
  const [articlesFilter, setArticlesFilter] = useState("");

  const [expandedPosts, setExpandedPosts] = useState(false);
  const [expandedZines, setExpandedZines] = useState(false);
  const [expandedStatements, setExpandedStatements] = useState(false);
  const [expandedPodcasts, setExpandedPodcasts] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState(false);

  const posts = postsFilter ? data.posts.filter((p) => p.chapter === postsFilter) : data.posts;
  const zines = zinesFilter ? data.zines.filter((z) => z.chapter === zinesFilter) : data.zines;
  const statements = statementsFilter ? data.statements.filter((s) => s.chapter === statementsFilter) : data.statements;
  const podcasts = podcastsFilter ? data.podcasts.filter((p) => p.chapter === podcastsFilter) : data.podcasts;
  const articles = articlesFilter ? data.articles.filter((a) => a.chapter === articlesFilter) : data.articles;

  const shownPosts = expandedPosts ? posts : posts.slice(0, PREVIEW);
  const shownZines = expandedZines ? zines : zines.slice(0, PREVIEW);
  const shownStatements = expandedStatements ? statements : statements.slice(0, PREVIEW);
  const shownPodcasts = expandedPodcasts ? podcasts : podcasts.slice(0, PREVIEW);
  const shownArticles = expandedArticles ? articles : articles.slice(0, PREVIEW);

  return (
    <>
      {/* Posts */}
      <section id="posts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 01</p>
          <h2 className="display mt-2 text-2xl">Social posts</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Fresh from our social channels.</p>
          <FilterBar section="posts" active={postsFilter} onChange={setPostsFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownPosts.map((p) => (
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
          {!expandedPosts && posts.length > PREVIEW && (
            <div className="mt-8">
              <button onClick={() => setExpandedPosts(true)} className={VIEW_ALL}>View all {posts.length}</button>
            </div>
          )}
          {posts.length === 0 && <EmptyState message="No posts yet." />}
        </div>
      </section>

      {/* Zines */}
      <section id="zines" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 02</p>
          <h2 className="display mt-2 text-2xl">Zines</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Art and writing from the movement.</p>
          <FilterBar section="zines" active={zinesFilter} onChange={setZinesFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownZines.map((z) => (
              <Link key={z.slug} href="/media" className={CARD}>
                <span className={TAG}>{chapterLabel(z.chapter)}</span>
                <h3 className="mt-3 display text-xl">{z.title}</h3>
                <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{z.excerpt}</p>
                {z.author ? (
                  <p className="mono mt-3 truncate text-[11px] uppercase tracking-[0.14em] text-ink/40">{z.author}</p>
                ) : null}
              </Link>
            ))}
          </div>
          {!expandedZines && zines.length > PREVIEW && (
            <div className="mt-8">
              <button onClick={() => setExpandedZines(true)} className={VIEW_ALL}>View all {zines.length}</button>
            </div>
          )}
          {zines.length === 0 && <EmptyState message="No zines yet." />}
        </div>
      </section>

      {/* Statements */}
      <section id="statements" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 03</p>
          <h2 className="display mt-2 text-2xl">Statements</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Official positions, on the record.</p>
          <FilterBar section="statements" active={statementsFilter} onChange={setStatementsFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownStatements.map((s) => (
              <Link key={s.slug} href={`/chapters/${s.chapter}/statements/${s.slug}`} className={CARD}>
                <span className={TAG}>{chapterLabel(s.chapter)}</span>
                <h3 className="mt-3 display text-xl">{s.title}</h3>
                <p className="mt-2 text-[13px] text-ink/60 line-clamp-3">{s.preview}</p>
              </Link>
            ))}
          </div>
          {!expandedStatements && statements.length > PREVIEW && (
            <div className="mt-8">
              <button onClick={() => setExpandedStatements(true)} className={VIEW_ALL}>View all {statements.length}</button>
            </div>
          )}
          {statements.length === 0 && <EmptyState message="No statements yet." />}
        </div>
      </section>

      {/* Podcasts */}
      <section id="podcasts" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 04</p>
          <h2 className="display mt-2 text-2xl">Podcasts</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Conversations with the movement.</p>
          <FilterBar section="podcasts" active={podcastsFilter} onChange={setPodcastsFilter} />
          {shownPodcasts.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shownPodcasts.map((p) => (
                <div key={p.slug} className={CARD}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={TAG}>{chapterLabel(p.chapter)}</span>
                    {p.date ? (
                      <span className="mono truncate text-[11px] tracking-[0.08em] text-ink/40">{p.date}</span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 display text-xl">{p.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Coming soon." />
          )}
          {!expandedPodcasts && podcasts.length > PREVIEW && (
            <div className="mt-8">
              <button onClick={() => setExpandedPodcasts(true)} className={VIEW_ALL}>View all {podcasts.length}</button>
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section id="articles" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 05</p>
          <h2 className="display mt-2 text-2xl">News articles</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Coverage in the press.</p>
          <FilterBar section="articles" active={articlesFilter} onChange={setArticlesFilter} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownArticles.map((a) => (
              <a key={`${a.url}-${a.title}`} href={a.url} target="_blank" rel="noreferrer" className={CARD}>
                <div className="flex items-center justify-between gap-3">
                  <span className="mono truncate text-[11px] uppercase tracking-[0.14em] text-ink/50">{a.outlet}</span>
                  <span className={TAG}>{chapterLabel(a.chapter)}</span>
                </div>
                <h3 className="mt-3 display text-xl">{a.title}</h3>
              </a>
            ))}
          </div>
          {!expandedArticles && articles.length > PREVIEW && (
            <div className="mt-8">
              <button onClick={() => setExpandedArticles(true)} className={VIEW_ALL}>View all {articles.length}</button>
            </div>
          )}
          {articles.length === 0 && <EmptyState message="No coverage yet." />}
        </div>
      </section>
    </>
  );
}
