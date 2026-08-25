import { readSheet } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";

type MediaItem = {
  id: string;
  type: "Article" | "Statement" | "Zine" | "Social";
  title: string;
  chapter: string;
  date: string;
  url: string;
};

async function getMediaItems(): Promise<MediaItem[]> {
  const [newsResult, stmtResult, zineResult] = await Promise.allSettled([
    readSheet("News"),
    readSheet("Statements"),
    readSheet("Zines", { status: "approved" }),
  ]);

  const items: MediaItem[] = [];

  if (newsResult.status === "fulfilled") {
    for (const r of newsResult.value) {
      items.push({
        id: `news-${r.url ?? r.title}`,
        type: "Article",
        title: r.title ?? "",
        chapter: "ligamy",
        date: r.fetched_at ?? "",
        url: r.url ?? "#",
      });
    }
  }

  if (stmtResult.status === "fulfilled") {
    for (const r of stmtResult.value) {
      items.push({
        id: `stmt-${r.slug}`,
        type: "Statement",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.date ?? "",
        url: `/chapters/${r.chapter_slug}/statements/${r.slug}`,
      });
    }
  }

  if (zineResult.status === "fulfilled") {
    for (const r of zineResult.value) {
      items.push({
        id: `zine-${r.slug}`,
        type: "Zine",
        title: r.title ?? "",
        chapter: r.chapter_slug ?? "ligamy",
        date: r.created_at ?? "",
        url: "/media",
      });
    }
  }

  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).slice(0, 3);
}

const TYPE_SKIN: Record<string, string> = {
  Article: "border-brand/40 bg-brand/10 text-brand",
  Statement: "border-ink/40 bg-ink/10 text-ink",
  Zine: "border-pink/40 bg-pink/10 text-pink",
  Social: "border-cyan/40 bg-cyan/10 text-cyan",
};

export async function MediaSection() {
  const items = await getMediaItems();

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
