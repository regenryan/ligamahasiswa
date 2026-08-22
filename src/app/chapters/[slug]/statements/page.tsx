import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";

type Statement = {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
};

async function getChapterStatements(slug: string): Promise<Statement[]> {
  try {
    const rows = await readSheet("Statements", { chapter_slug: slug });
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      author: r.author ?? "",
      date: r.date ?? "",
      excerpt: (r.content ?? "").slice(0, 200),
    }));
  } catch {
    return [];
  }
}

export default async function ChapterStatementsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const statements = await getChapterStatements(slug);

  return (
    <Shell dir={27}>
      <PageHead
        kicker={ch.name}
        title="Statements"
        sub={`Official statements from the ${ch.short} chapter.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          {statements.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No statements from this chapter yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {statements.map((s) => (
                <Link
                  key={s.slug}
                  href={`/chapters/${slug}/statements/${s.slug}`}
                  className="block border border-line bg-cream p-6 hover:border-brand transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{s.author}</span>
                    {s.date && <span className="mono text-[11px] text-ink/40">{s.date}</span>}
                  </div>
                  <h3 className="mt-2 display text-xl">{s.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/70 line-clamp-2">{s.excerpt}</p>
                </Link>
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
