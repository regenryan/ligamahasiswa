"use client";

import { useState } from "react";
import { Shell } from "@/components/shells";
import {
  PageHead,
  SectionHead,
  Btn,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { Reveal, FilterPills } from "@/components/interactive";
import { ZineCard } from "@/components/sections";
import { chapters, zinePosts } from "@/lib/mock";

const DIR = 27;

type ChapterFilter = "All" | "Malaysia" | "UM" | "UTM" | "UniSZA";
const FILTERS: ChapterFilter[] = ["All", "Malaysia", "UM", "UTM", "UniSZA"];

function ZineGrid() {
  const [filter, setFilter] = useState<ChapterFilter>("All");
  const slug =
    filter === "All" ? null : (chapters.find((c) => c.short === filter)?.slug ?? null);
  const items = slug === null ? zinePosts : zinePosts.filter((z) => z.chapterSlug === slug);
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
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} label="Chapter" />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((z, i) => (
            <Reveal key={z.slug} delay={i * 60}>
              <ZineCard z={z} />
            </Reveal>
          ))}
        </div>
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
        <Btn kind="ghost" href="#join">
          Pitch a story
        </Btn>
      </div>
    </section>
  );
}

export default function ZinePage() {
  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Zine"
        title="The zine"
        sub="Essays, letters, and notes from the movement. Written by students, printed when we can afford it."
      />
      <ZineGrid />
      <WriteBand />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
