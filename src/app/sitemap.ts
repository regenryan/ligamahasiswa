import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://liga.vercel.app";
  const now = new Date().toISOString();

  const chapters = ["ligamy", "ligaum", "ligautm", "ligausm", "ligaunisza", "sparcutem"];

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/chapters`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/campaigns`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/fundraise`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/election`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/media`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...chapters.map((ch) => ({
      url: `${base}/chapters/${ch}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
