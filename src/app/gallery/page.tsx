import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";

async function getGallery() {
  try {
    const rows = await readSheet("Gallery");
    return rows.map((r) => ({
      id: r.id ?? "",
      imageUrl: r.image_url ?? "",
      caption: r.caption ?? "",
      chapterSlug: r.chapter_slug ?? "",
      eventSlug: r.event_slug ?? "",
    }));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Gallery"
        title="Moments from the movement"
        sub="Photos from assemblies, campaigns, and campus actions across Malaysia."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          {images.length === 0 ? (
            <div className="border border-dashed border-line p-12 text-center">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/40">
                Gallery coming soon
              </p>
              <p className="mt-3 text-[14px] text-ink/60">
                Photos from our events and campaigns will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <figure
                  key={img.id}
                  className="overflow-hidden border border-line bg-cream"
                >
                  <div className="aspect-square bg-midnight flex items-center justify-center">
                    {img.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.imageUrl}
                        alt={img.caption}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="mono text-[11px] text-ink/30">No image</span>
                    )}
                  </div>
                  {img.caption ? (
                    <figcaption className="p-3 text-[13px] text-ink/70">
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
