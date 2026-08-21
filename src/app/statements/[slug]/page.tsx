import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import Link from "next/link";

async function getStatement(slug: string) {
  try {
    const rows = await readSheet("Statements", { slug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? "",
        title: r.title ?? "",
        author: r.author ?? "",
        chapterSlug: r.chapter_slug ?? "",
        content: r.content ?? "",
        date: r.date ?? "",
      };
    }
  } catch {
    // fall through
  }
  return null;
}

export default async function StatementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const statement = await getStatement(slug);

  if (!statement) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Statements" title="Statement not found" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/statements" className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
            {"\u2190"} All statements
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell dir={27}>
      <PageHead
        kicker={`Statements / ${statement.chapterSlug === "malaysia" ? "National" : statement.chapterSlug.toUpperCase()}`}
        title={statement.title}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="mono text-[12px] text-ink/50">{statement.date}</span>
            <span className="text-[12px] font-bold text-ink/60">{statement.author}</span>
          </div>
          <div className="prose mt-8 text-[15px] leading-relaxed text-ink/80">
            {statement.content.split("\n").map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>
          <Link href="/statements" className="press mt-8 inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
            {"\u2190"} All statements
          </Link>
        </div>
      </section>
    </Shell>
  );
}
