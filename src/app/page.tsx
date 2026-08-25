import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  Hero,
  CampaignSection,
  ShopStrip,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { Introduction } from "@/components/sections/introduction";
import { Principles } from "@/components/sections/principles";
import { Slogan } from "@/components/sections/slogan";
import { MemberTeaser } from "@/components/sections/member-teaser";
import { EventsSection } from "@/components/sections/events-section";
import { MediaSectionAsync } from "@/components/sections/media-section-async";
import { campaigns } from "@/lib/mock";

const DIR = 27;

export default function Home() {
  return (
    <Shell dir={DIR}>
      <Hero chapterName="Liga Mahasiswa Malaysia" campaign={campaigns[0]} />
      <Introduction />
      <Principles />
      <Slogan />
      <MemberTeaser />
      <CampaignSection />
      <Suspense fallback={null}>
        <EventsSection />
      </Suspense>
      <CartProvider>
        <ShopStrip />
      </CartProvider>
      <MediaSectionAsync />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
