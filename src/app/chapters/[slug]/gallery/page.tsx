import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
};

async function getChapterGallery(slug: string): Promise<GalleryItem[]> {
  try {
    const rows = await readSheet("Gallery", { chapter_slug: slug });
    return rows.map((r) => ({
      id: r.id ?? "",
      imageUrl: r.image_url ?? "",
      caption: r.caption ?? "",
      likes: Number(r.likes ?? "0"),
    }));
  } catch {
    return [];
  }
}

export default async function ChapterGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const gallery = await getChapterGallery(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.name}
        title="Gallery"
        sub={`Photos and moments from the ${ch.short} chapter.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          {gallery.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No gallery items from this chapter yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article key={item.id} className="border border-line bg-cream overflow-hidden">
                  <div className="aspect-square bg-midnight flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                    ) : (
                      <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/30">Photo</span>
                    )}
                  </div>
                  {item.caption && (
                    <div className="p-4">
                      <p className="text-[13px] text-ink/70">{item.caption}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Link
        href={`/chapters/${slug}`}
        className="mx-auto block w-full max-w-6xl border-b border-line px-4 py-6 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/50 hover:text-brand transition-colors"
      >
        Back to chapter
      </Link>
    </Shell>
  );
}
