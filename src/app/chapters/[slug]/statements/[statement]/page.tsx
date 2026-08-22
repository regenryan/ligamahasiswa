import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters } from "@/lib/mock";
import Link from "next/link";
import { ShareKit } from "@/components/ShareKit";

type Statement = {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
};

async function getStatement(chapterSlug: string, statementSlug: string): Promise<Statement | null> {
  try {
    const rows = await readSheet("Statements", { slug: statementSlug, chapter_slug: chapterSlug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? "",
        title: r.title ?? "",
        author: r.author ?? "",
        date: r.date ?? "",
        content: r.content ?? "",
      };
    }
  } catch {
    // fall through
  }
  return null;
}

export default async function ChapterStatementDetailPage({
  params,
}: {
  params: Promise<{ slug: string; statement: string }>;
}) {
  const { slug, statement: statementSlug } = await params;
  const ch = mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
  const statement = await getStatement(slug, statementSlug);

  if (!statement) {
    return (
      <Shell dir={27}>
        <PageHead kicker={ch.name} title="Statement not found" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href={`/chapters/${slug}/statements`} className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
            Back to statements
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell dir={27}>
      <PageHead
        kicker={`${ch.name} / Statement`}
        title={statement.title}
        sub={statement.author ? `By ${statement.author}` : undefined}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          {statement.date && (
            <p className="mono mb-6 text-[11px] uppercase tracking-[0.14em] text-ink/50">{statement.date}</p>
          )}
          <div className="prose max-w-none text-[15px] leading-relaxed text-ink/80 whitespace-pre-wrap">
            {statement.content}
          </div>
          <div className="mt-10">
            <ShareKit title={statement.title} url={`https://ligamahasiswa.vercel.app/chapters/${slug}/statements/${statementSlug}`} />
          </div>
        </div>
      </section>
      <Link
        href={`/chapters/${slug}/statements`}
        className="mx-auto block w-full max-w-6xl border-b border-line px-4 py-6 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/50 hover:text-brand transition-colors"
      >
        Back to statements
      </Link>
    </Shell>
  );
}
