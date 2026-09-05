"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { CHAPTERS, chapterLabel } from "@/lib/chapter-constants";
import { Pagination, paginate } from "@/components/pagination";
import type { CampaignData } from "@/lib/queries";

const FILTER_BTN =
  "press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors";

function CampaignCard({ c, hrefOverride }: { c: CampaignData; hrefOverride?: string }) {
  const href = hrefOverride ?? `/chapters/${c.chapterSlug}/campaigns/${c.slug}`;
  return (
    <Link
      href={href}
      className="border border-line bg-cream p-6 hover:border-brand transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="border border-line px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/60">
          {chapterLabel(c.chapterSlug)}
        </span>
      </div>
      <h3 className="mt-3 display text-xl">{c.name}</h3>
      <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{c.summary}</p>
    </Link>
  );
}

export function CampaignsClient({ campaigns }: { campaigns: CampaignData[] }) {
  const [chapter, setChapter] = useState<string>("");
  const [page, setPage] = useState(1);

  const fundraisers = campaigns.slice(0, 3);
  const filtered = chapter
    ? campaigns.filter((c) => c.chapterSlug === chapter)
    : campaigns;
  const { items: pagedCampaigns, totalPages } = paginate(filtered, page);

  const updateUrl = useCallback((slug: string) => {
    const url = slug ? `/campaigns?chapter=${slug}` : "/campaigns";
    window.history.replaceState(null, "", url);
  }, []);

  const handleChapterChange = (slug: string) => {
    setChapter(slug);
    setPage(1);
    updateUrl(slug);
  };

  return (
    <>
      <section id="fundraise" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 01</p>
          <h2 className="display mt-2 text-2xl">Fundraise</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Top active campaigns taking donations right now.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fundraisers.map((c) => (
              <CampaignCard key={`${c.chapterSlug}-${c.slug}`} c={c} hrefOverride={`/chapters/${c.chapterSlug}/campaigns/${c.slug}/fundraise`} />
            ))}
          </div>
          {fundraisers.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No active fundraisers right now.</p>
            </div>
          )}
        </div>
      </section>

      <section id="campaigns" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Section 02</p>
          <h2 className="display mt-2 text-2xl">All campaigns</h2>
          <p className="mono mt-1 text-[13px] text-ink/50">Every fight across every chapter.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleChapterChange("")}
              className={`${FILTER_BTN} ${!chapter ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
            >
              All
            </button>
            {CHAPTERS.map((ch) => (
              <button
                key={ch.slug}
                onClick={() => handleChapterChange(ch.slug)}
                className={`${FILTER_BTN} ${chapter === ch.slug ? "border-brand bg-brand/10 text-brand" : "border-line text-ink/60 hover:border-ink hover:text-ink"}`}
              >
                {chapterLabel(ch.slug)}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pagedCampaigns.map((c) => (
              <CampaignCard key={`${c.chapterSlug}-${c.slug}`} c={c} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No campaigns for this chapter yet.</p>
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </>
  );
}
