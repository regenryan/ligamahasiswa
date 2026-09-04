import type { Metadata } from "next";
import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { dbGetCampaigns, type CampaignData } from "@/lib/queries";
import { CampaignsClient } from "./campaigns-client";

const DIR = 27;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export const metadata: Metadata = {
  title: "Campaigns",
  description:
    "The campaigns and fights of the Malaysian student movement. Abolish AUKU, free the campus.",
  openGraph: {
    title: "Campaigns | Liga Mahasiswa Malaysia",
    description:
      "The campaigns and fights of the Malaysian student movement.",
    url: `${siteUrl}/campaigns`,
    siteName: "Liga Mahasiswa Malaysia",
    locale: "en_MY",
    type: "website",
  },
  alternates: { canonical: `${siteUrl}/campaigns` },
};

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
    </Shell>
  );
}
