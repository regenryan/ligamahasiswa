import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { campaigns as mockCampaigns } from "@/lib/mock";
import type { Campaign } from "@/lib/mock";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";

async function getChapterCampaigns(slug: string): Promise<Campaign[]> {
  try {
    const rows = await readSheet("Campaigns", { chapter_slug: slug });
    if (rows.length === 0) {
      return mockCampaigns.filter((c) => c.chapterSlug === slug);
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
    return mockCampaigns.filter((c) => c.chapterSlug === slug);
  }
}

export default async function ChapterCampaignsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const campaigns = await getChapterCampaigns(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.name}
        title="Campaigns"
        sub={`All campaigns run by the ${ch.short} chapter.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          {campaigns.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No campaigns from this chapter yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/chapters/${c.chapterSlug}/campaigns/${c.slug}`}
                  className="border border-line bg-cream p-6 hover:border-brand transition-colors"
                >
                  <span className={`inline-flex border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                    c.status === "Active" ? "border-term/40 bg-term/10 text-term" :
                    c.status === "Won" ? "border-brand/40 bg-brand/10 text-brand-text" :
                    "border-ink/20 bg-ink/5 text-ink/60"
                  }`}>{c.status}</span>
                  <h3 className="mt-3 display text-xl">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/70 line-clamp-3">{c.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Link
        href={`/chapters/${slug}`}
        className="mx-auto block w-full max-w-6xl border-b border-line px-4 py-6 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/50 hover:text-brand transition-colors"
      >
        Back to chapter
      </Link>
    </Shell>
  );
}
