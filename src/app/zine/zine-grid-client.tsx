"use client";

import { useState } from "react";
import { SectionHead } from "@/components/sections/head";
import { Reveal, FilterPills } from "@/components/interactive";
import { ZineCard } from "@/components/sections/cards";
import type { ZinePost } from "@/lib/mock";

const CHAPTER_FILTERS = ["All", "Malaysia", "UM", "UTM", "UniSZA"] as const;
type ChapterFilter = (typeof CHAPTER_FILTERS)[number];

const SLUG_MAP: Record<string, string> = {
  Malaysia: "malaysia",
  UM: "um",
  UTM: "utm",
  UniSZA: "unisza",
};

function ZineGrid({ posts }: { posts: ZinePost[] }) {
  const [filter, setFilter] = useState<ChapterFilter>("All");
  const slug = filter === "All" ? null : SLUG_MAP[filter] ?? null;
  const items = slug === null ? posts : posts.filter((z) => z.chapterSlug === slug);

  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={1}
            title="Latest posts"
            sub="Letters from the movement, filed by chapter. New ones drop weekly."
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills options={[...CHAPTER_FILTERS]} value={filter} onChange={setFilter} label="Chapter" />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((z, i) => (
            <Reveal key={z.slug} delay={i * 60}>
              <ZineCard z={z} />
            </Reveal>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">
            No zine posts from this chapter yet. Write one!
          </p>
        ) : null}
      </div>
    </section>
  );
}

function WriteBand() {
  return (
    <section className="border-b border-line bg-midnight">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
        <div>
          <p className="display text-2xl sm:text-3xl">Write for the zine</p>
          <p className="mt-2 max-w-xl text-[14px] text-ink/60">
            Essays, letters, comics, field notes from any campus. Bylines always.
          </p>
        </div>
        <a href="/zine/submit" className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
          Pitch a story
        </a>
      </div>
    </section>
  );
}

export function ZineGridClient({ posts }: { posts: ZinePost[] }) {
  return (
    <>
      <ZineGrid posts={posts} />
      <WriteBand />
    </>
  );
}
