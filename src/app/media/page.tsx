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
import { MediaCard } from "@/components/sections";
import { mediaItems } from "@/lib/mock";

const DIR = 27;

type KindFilter = "All" | "Video" | "Podcast" | "Article";
const FILTERS: KindFilter[] = ["All", "Video", "Podcast", "Article"];

function MediaGrid() {
  const [filter, setFilter] = useState<KindFilter>("All");
  const items = filter === "All" ? mediaItems : mediaItems.filter((m) => m.kind === filter);
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={1}
            title="Coverage"
            sub="The outlets that showed up, and what they ran."
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} label="Kind" />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((m, i) => (
            <Reveal key={m.slug} delay={i * 60}>
              <MediaCard m={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PressBand() {
  return (
    <section className="border-b border-line bg-midnight">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
        <div>
          <p className="display text-2xl sm:text-3xl">Media inquiries</p>
          <p className="mono mt-2 text-[14px] text-ink/70">media@ligamahasiswa.my</p>
          <p className="mt-1 max-w-xl text-[13px] text-ink/60">
            Statement requests and interview slots, answered within 48 hours.
          </p>
        </div>
        <Btn kind="act" href="mailto:media@ligamahasiswa.my">
          Request a statement
        </Btn>
      </div>
    </section>
  );
}

export default function MediaPage() {
  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Media"
        title="Press & media"
        sub="Coverage of the movement from the outlets that showed up."
      />
      <MediaGrid />
      <PressBand />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
