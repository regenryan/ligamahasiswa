import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { getChapter, CHAPTERS } from "@/lib/chapters";
import { dbGetCampaignsByChapter } from "@/lib/queries";
import type { CampaignData } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getChapterCampaigns(slug: string): Promise<CampaignData[]> {
  const chapterId = await getChapterId(slug);
  if (!chapterId) return [];
  return dbGetCampaignsByChapter(chapterId);
}

async function getChapterId(slug: string): Promise<string | null> {
  const chapter = await getChapter(slug);
  return chapter?.chapterId ?? null;
}

export default async function ChapterCampaignsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = CHAPTERS.find((c) => c.slug === slug);
  if (!ch) notFound();
  const campaigns = await getChapterCampaigns(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.label}
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
                  href={`/chapters/${slug}/campaigns/${c.slug}`}
                  className="border border-line bg-cream p-6 hover:border-brand transition-colors"
                >
                  <span className="inline-flex border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-text">
                    Active
                  </span>
                  <h3 className="mt-3 display text-xl">{c.name}</h3>
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
