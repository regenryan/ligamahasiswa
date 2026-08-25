import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { campaigns as mockCampaigns, type Campaign } from "@/lib/mock";
import { CampaignsClient } from "./campaigns-client";

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

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Campaigns"
        title="Campaigns"
        sub="What the movement is fighting for."
      />
      <CampaignsClient campaigns={campaigns} />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
