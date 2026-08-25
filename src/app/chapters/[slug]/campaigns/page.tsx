import { Shell } from "@/components/shells";
import { PageHead, SectionHead, StatusChip } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { campaigns as mockCampaigns } from "@/lib/mock";
import type { Campaign } from "@/lib/mock";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const ch = mockChapters.find((c) => c.slug === slug);
  if (!ch) notFound();
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
          <Link
            href={`/chapters/${slug}`}
            className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
          >
            {"\u2190"} Back to chapter
          </Link>
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
                  <StatusChip status={c.status} />
                  <h3 className="mt-3 display text-xl">{c.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/70 line-clamp-3">{c.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
