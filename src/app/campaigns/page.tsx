import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { CHAPTERS, chapterLabel } from "@/lib/chapters";
import { campaigns as mockCampaigns, type Campaign } from "@/lib/mock";
import Link from "next/link";

const DIR = 27;

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const rows = await readSheet("Campaigns");
    if (rows.length === 0) return mockCampaigns;
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
    return mockCampaigns;
  }
}

function CampaignCard({ c }: { c: Campaign }) {
  const href = `/chapters/${c.chapterSlug}/campaigns/${c.slug}`;
  return (
    <Link
      href={href}
      className="border border-line bg-cream p-6 hover:border-brand transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="border border-line px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/60">
          {chapterLabel(c.chapterSlug)}
        </span>
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
          {c.status}
        </span>
      </div>
      <h3 className="mt-3 display text-xl">{c.title}</h3>
      <p className="mt-2 text-[13px] text-ink/60 line-clamp-2">{c.summary}</p>
      {c.status === "Active" && (
        <span className="mono mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-brand underline underline-offset-4">
          Fundraise
        </span>
      )}
    </Link>
  );
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  const params = await searchParams;
  const chapterFilter = params.chapter;
  const campaigns = await getCampaigns();

  const fundraisers = campaigns.filter((c) => c.status === "Active").slice(0, 3);
  const filtered = chapterFilter
    ? campaigns.filter((c) => c.chapterSlug === chapterFilter)
    : campaigns;

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Campaigns"
        title="Campaigns"
        sub="What the movement is fighting for."
      />

      <section id="fundraise" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            index={1}
            title="Fundraise"
            sub="Top active campaigns taking donations right now."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fundraisers.map((c) => (
              <CampaignCard key={`${c.chapterSlug}-${c.slug}`} c={c} />
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
          <SectionHead
            index={2}
            title="All campaigns"
            sub="Every fight across every chapter."
          />

          <div className="flex flex-wrap gap-2">
            <Link
              href="/campaigns"
              className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                !chapterFilter
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              All
            </Link>
            {CHAPTERS.map((ch) => (
              <Link
                key={ch.slug}
                href={`/campaigns?chapter=${ch.slug}`}
                className={`press border px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  chapterFilter === ch.slug
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                {chapterLabel(ch.slug)}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CampaignCard key={`${c.chapterSlug}-${c.slug}`} c={c} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No campaigns for this chapter yet.</p>
            </div>
          )}
        </div>
      </section>

      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
