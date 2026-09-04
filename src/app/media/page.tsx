import type { Metadata } from "next";
import { Shell } from "@/components/shells";
import { PageHead, JoinBand } from "@/components/sections";
import { MediaClient } from "./media-client";
import { dbGetMedia } from "@/lib/queries";

const DIR = 27;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Stories, coverage, and voices from the Malaysian student movement.",
  openGraph: {
    title: "Media | Liga Mahasiswa Malaysia",
    description:
      "Stories, coverage, and voices from the Malaysian student movement.",
    url: `${siteUrl}/media`,
    siteName: "Liga Mahasiswa Malaysia",
    locale: "en_MY",
    type: "website",
  },
  alternates: { canonical: `${siteUrl}/media` },
};

export default async function MediaPage() {
  const allMedia = await dbGetMedia();
  
  const posts = allMedia
    .filter(m => m.type === "social")
    .map(m => ({
      id: m.id,
      platform: "instagram", // We default to instagram since we didn't store platform separately, or we could parse from URL
      caption: m.name || m.description || "View post",
      url: m.link,
      chapter: m.chapterId ?? "ligamy"
    }));
    
  const zines = allMedia
    .filter(m => m.type === "zine")
    .map(m => ({
      slug: m.slug,
      title: m.name || "Untitled Zine",
      excerpt: m.description || "",
      author: m.author || "Anonymous",
      chapter: m.chapterId ?? "ligamy"
    }));
    
  const statements = allMedia
    .filter(m => m.type === "statement")
    .map(m => ({
      slug: m.slug,
      title: m.name || "Untitled Statement",
      preview: m.description || "",
      chapter: m.chapterId ?? "ligamy"
    }));
    
  const podcasts = allMedia
    .filter(m => m.type === "podcast")
    .map(m => ({
      slug: m.slug,
      title: m.name || "Untitled Podcast",
      date: m.date || m.createdAt.split('T')[0],
      chapter: m.chapterId ?? "ligamy"
    }));
    
  const articles = allMedia
    .filter(m => m.type === "article" || m.type === "news")
    .map(m => ({
      title: m.name || "Untitled Article",
      outlet: m.author || "External site",
      url: m.link,
      chapter: m.chapterId ?? "ligamy"
    }));

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Media" title="Media" sub="Stories, coverage, and voices from the movement." />
      <MediaClient data={{ posts, zines, statements, podcasts, articles }} />
      <JoinBand />
    </Shell>
  );
}