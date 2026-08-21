import { Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  Hero,
  Evidence,
  MemberTeaser,
  CampaignSection,
  ShopStrip,
  StoryStrip,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { CartProvider } from "@/components/interactive";
import { campaigns } from "@/lib/mock";

const DIR = 27;

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <Hero chapterName="Liga Mahasiswa Malaysia" campaign={campaigns[0]} />
        <Evidence />
        <MemberTeaser />
        <CampaignSection />
        <CartProvider>
          <ShopStrip />
        </CartProvider>
        <StoryStrip />
        <JoinBand />
        <NewsletterBand />
      </Shell>
    </Suspense>
  );
}
