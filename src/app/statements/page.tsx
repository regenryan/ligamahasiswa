import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";

interface Statement {
  slug: string;
  title: string;
  author: string;
  chapterSlug: string;
  excerpt: string;
  date: string;
}

async function getStatements(): Promise<Statement[]> {
  try {
    const rows = await readSheet("Statements");
    return rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.title ?? "",
      author: r.author ?? "",
      chapterSlug: r.chapter_slug ?? "",
      excerpt: r.content?.slice(0, 200) ?? "",
      date: r.date ?? "",
    }));
  } catch {
    return [];
  }
}

export default async function StatementsPage() {
  const statements = await getStatements();

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Statements"
        title="On the record"
        sub="Official positions, press statements, and open letters from Liga Mahasiswa."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          {statements.length === 0 ? (
            <p className="text-center text-[14px] text-ink/50">
              No statements published yet.
            </p>
          ) : (
            <div className="space-y-4">
              {statements.map((s) => (
                <Link
                  key={s.slug}
                  href={`/statements/${s.slug}`}
                  className="block border border-line bg-cream p-6 hover:border-brand transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                      {s.chapterSlug === "malaysia" ? "National" : s.chapterSlug.toUpperCase()}
                    </span>
                    <span className="mono text-[11px] text-ink/40">{s.date}</span>
                  </div>
                  <h3 className="display mt-3 text-xl leading-snug">{s.title}</h3>
                  <p className="mt-2 text-[14px] text-ink/60">{s.excerpt}</p>
                  <p className="mono mt-3 text-[12px] font-bold text-ink/50">{s.author}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
