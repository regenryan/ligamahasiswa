import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { dbGetCampaigns, type CampaignData } from "@/lib/queries";
import { CampaignsClient } from "./campaigns-client";

const DIR = 27;

export default async function CampaignsPage() {
  const campaigns: CampaignData[] = await dbGetCampaigns();

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
