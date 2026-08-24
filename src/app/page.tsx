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
import { MediaSection } from "@/components/sections/media-section";
import { readSheet } from "@/lib/sheets-db";
import { campaigns } from "@/lib/mock";

const DIR = 27;

type MediaItem = {
  id: string;
  type: "Article" | "Statement" | "Zine" | "Social";
  title: string;
  chapter: string;
  date: string;
  url: string;
};

async function getMediaItems(): Promise<MediaItem[]> {
  const items: MediaItem[] = [];

  try {
    const news = await readSheet("News");
    for (const r of news) {
      items.push({
        id: `news-${r.url ?? r.title}`,
        type: "Article",
        title: r.title ?? "",
        chapter: "ligamy",
        date: r.fetched_at ?? "",
        url: r.url ?? "#",
      });
    }
  } catch {}

  try {
    const statements = await readSheet("Statements");
    for (const r of statements) {
      items.push({
        id: `stmt-${r.slug}`,
        type: "Statement",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.date ?? "",
        url: `/chapters/${r.chapter_slug}/statements/${r.slug}`,
      });
    }
  } catch {}

  try {
    const zines = await readSheet("Zines", { status: "approved" });
    for (const r of zines) {
      items.push({
        id: `zine-${r.slug}`,
        type: "Zine",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.created_at ?? "",
        url: "/media",
      });
    }
  } catch {}

  try {
    const social = await readSheet("Social");
    for (const r of social) {
      items.push({
        id: r.id ?? `social-${r.url}`,
        type: "Social",
        title: r.caption ?? r.platform ?? "Social post",
        chapter: "ligamy",
        date: r.date ?? r.created_at ?? "",
        url: r.url ?? "#",
      });
    }
  } catch {}

  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export default async function Home() {
  const mediaItems = await getMediaItems();

  return (
    <Shell dir={DIR}>
      <Hero chapterName="Liga Mahasiswa Malaysia" campaign={campaigns[0]} />
      <Introduction />
      <Principles />
      <Slogan />
      <MemberTeaser />
      <Suspense fallback={null}>
        <CampaignSection />
      </Suspense>
      <CartProvider>
        <ShopStrip />
      </CartProvider>
      <MediaSection items={mediaItems} />
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
