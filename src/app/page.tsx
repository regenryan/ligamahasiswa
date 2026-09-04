import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  Hero,
  JoinBand,
} from "@/components/sections";
import { Principles } from "@/components/sections/principles";
import { ChaptersSection } from "@/components/sections/chapters-section";
import { CampaignsSection } from "@/components/sections/campaigns-section";
import { EventsSection } from "@/components/sections/events-section";
import { MediaSectionAsync } from "@/components/sections/media-section-async";
import { SkeletonSectionHead, SkeletonCampaignGrid, SkeletonEventGrid } from "@/components/skeleton";
import { dbGetCampaigns, type CampaignData } from "@/lib/queries";

const DIR = 27;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Liga Mahasiswa Malaysia",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    "https://instagram.com/ligamahasiswa",
    "https://tiktok.com/@ligamahasiswa",
    "https://youtube.com/@ligamahasiswa",
  ],
  description:
    "The Malaysian student movement. Abolish AUKU, free the campus.",
};

export default async function Home() {
  const campaigns: CampaignData[] = await dbGetCampaigns();
  const [featured] = campaigns;

  return (
    <Shell dir={DIR}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero chapterName="Liga Mahasiswa Malaysia" campaign={featured} />
      <Principles />
      <ChaptersSection />
      <Suspense fallback={<div className="border-b border-line"><div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"><SkeletonSectionHead /><SkeletonCampaignGrid count={3} /></div></div>}>
        <CampaignsSection />
      </Suspense>
      <Suspense fallback={<div className="border-b border-line"><div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"><SkeletonSectionHead /><SkeletonEventGrid count={3} cols={2} /></div></div>}>
        <EventsSection />
      </Suspense>
      <MediaSectionAsync />
      <JoinBand />
    </Shell>
  );
}
