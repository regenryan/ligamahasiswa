import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { CampaignCard } from "@/components/sections/cards";
import { readSheet } from "@/lib/sheets-db";
import { campaigns as mockCampaigns } from "@/lib/mock";
import type { Campaign } from "@/lib/mock";

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

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Campaigns"
        title="Every campaign needs money and hands"
        sub="Pick one and get in. The fight does not wait."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
