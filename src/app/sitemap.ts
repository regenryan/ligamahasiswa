import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ligamahasiswamalaysia.vercel.app";
  const now = new Date().toISOString();

  const chapters = ["malaysia", "um", "utm", "usm", "unisza", "utem"];
  const campaigns = [
    { ch: "malaysia", slug: "mansuh-auku" },
    { ch: "malaysia", slug: "dialog-terbuka-kpt" },
    { ch: "malaysia", slug: "keadilan-zara-qairina" },
    { ch: "um", slug: "um-rumah-mandiri" },
    { ch: "malaysia", slug: "gabungan-palestin" },
    { ch: "malaysia", slug: "sekolah-migran" },
  ];

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/zine`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/media`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dashboard/card`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...chapters.map((ch) => ({
      url: `${base}/chapters/${ch}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...chapters.map((ch) => ({
      url: `${base}/chapters/${ch}/team`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...campaigns.map(({ ch, slug }) => ({
      url: `${base}/chapters/${ch}/campaigns/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
