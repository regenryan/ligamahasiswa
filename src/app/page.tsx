import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  Hero,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { Principles } from "@/components/sections/principles";
import { ChaptersSection } from "@/components/sections/chapters-section";
import { CampaignsSection } from "@/components/sections/campaigns-section";
import { EventsSection } from "@/components/sections/events-section";
import { MediaSectionAsync } from "@/components/sections/media-section-async";
import { SkeletonSectionHead, SkeletonEventGrid } from "@/components/skeleton";
import { campaigns } from "@/lib/mock";

const DIR = 27;

export default function Home() {
  return (
    <Shell dir={DIR}>
      <Hero chapterName="Liga Mahasiswa Malaysia" campaign={campaigns[0]} />
      <Principles />
      <ChaptersSection />
      <Suspense fallback={<div className="border-b border-line"><div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"><SkeletonSectionHead /><SkeletonEventGrid count={2} cols={2} /></div></div>}>
        <CampaignsSection />
      </Suspense>
      <Suspense fallback={<div className="border-b border-line"><div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"><SkeletonSectionHead /><SkeletonEventGrid count={3} cols={2} /></div></div>}>
        <EventsSection />
      </Suspense>
      <MediaSectionAsync />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
