import Link from "next/link";
import { dbGetMedia } from "@/lib/queries";

const TYPE_SKIN: Record<string, string> = {
  article: "border-brand/40 bg-brand/10 text-brand",
  statement: "border-ink/40 bg-ink/10 text-ink",
  zine: "border-pink/40 bg-pink/10 text-pink",
  social: "border-cyan/40 bg-cyan/10 text-cyan",
  podcast: "border-hi/40 bg-hi/10 text-hi",
};

export async function MediaSection() {
  const allMedia = await dbGetMedia();
  const items = allMedia.slice(0, 3).map(m => ({
    id: m.id,
    type: m.type || "article",
    title: m.name || "Untitled",
    url: m.link
  }));

  return (
    <section className="border-b border-line" id="media">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">From the movement</p>
            <h2 className="display mt-2 text-3xl sm:text-5xl">Media</h2>
          </div>
          <Link href="/media" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            View all
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel={item.url.startsWith("http") ? "noreferrer" : undefined}
                className="group flex flex-col border border-line bg-cream p-6 hover:border-brand transition-colors"
              >
                <span className={`self-start border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${TYPE_SKIN[item.type] ?? "border-line text-ink/60"}`}>
                  {item.type}
                </span>
                <h3 className="display mt-4 text-lg leading-snug">{item.title}</h3>
                <div className="mt-auto pt-4">
                  <p className="mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                    Read →
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-line p-8 text-center">
            <p className="text-[14px] text-ink/50">No content available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}