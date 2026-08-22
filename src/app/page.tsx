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
import { LiveFeed } from "@/components/LiveFeed";
import { SocialStrip } from "@/components/sections/social-strip";
import { campaigns } from "@/lib/mock";

const DIR = 27;

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <Hero chapterName="Liga Mahasiswa Malaysia" campaign={campaigns[0]} />
        <LiveFeed />
        <Evidence />
        <MemberTeaser />
        <CampaignSection />
        <CartProvider>
          <ShopStrip />
        </CartProvider>
        <SocialStrip />
        <StoryStrip />
        <JoinBand />
        <NewsletterBand />
      </Shell>
    </Suspense>
  );
}
