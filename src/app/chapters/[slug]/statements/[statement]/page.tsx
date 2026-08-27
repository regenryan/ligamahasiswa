import { Shell } from "@/components/shells";
import { PageHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { chapterLabel, getChapterSync } from "@/lib/chapters";
import { statements as mockStatements } from "@/lib/mock";
import { ShareKit } from "@/components/ShareKit";
import Link from "next/link";
import { notFound } from "next/navigation";

const DIR = 27;

type StatementData = {
  slug: string;
  title: string;
  content: string;
  date: string;
  author: string;
  chapterSlug: string;
};

async function getStatement(slug: string, statementSlug: string): Promise<StatementData | null> {
  try {
    const rows = await readSheet("Statements", { chapter_slug: slug, slug: statementSlug });
    if (rows.length > 0) {
      const r = rows[0];
      return {
        slug: r.slug ?? statementSlug,
        title: r.title ?? "",
        content: r.content ?? r.body ?? "",
        date: r.date ?? "",
        author: r.author ?? "",
        chapterSlug: r.chapter_slug ?? slug,
      };
    }
  } catch {}
  const mock = mockStatements.find((s) => s.slug === statementSlug && s.chapterSlug === slug);
  if (mock) {
    return {
      slug: mock.slug,
      title: mock.title,
      content: mock.content,
      date: mock.date,
      author: mock.author,
      chapterSlug: mock.chapterSlug,
    };
  }
  return null;
}

export default async function StatementPage({
  params,
}: {
  params: Promise<{ slug: string; statement: string }>;
}) {
  const { slug, statement: statementSlug } = await params;
  const statement = await getStatement(slug, statementSlug);
  const chapter = getChapterSync(slug);
  if (!chapter) notFound();

  if (!statement) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Statements" title="Statement not found" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <Link
              href={`/chapters/${slug}`}
              className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
            >
              {"\u2190"} Back to {chapter.label}
            </Link>
          </div>
        </section>
        <JoinBand />
        <NewsletterBand />
      </Shell>
    );
  }

  return (
    <Shell dir={DIR}>
      <PageHead kicker={chapterLabel(slug)} title={statement.title} sub={statement.date} />

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <Link
            href={`/chapters/${slug}`}
            className="mono mb-8 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
          >
            {"\u2190"} Back to {chapter.label}
          </Link>
          <div className="text-[15px] leading-relaxed text-ink/70">
            {statement.content.split("\n").map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Issued by</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="display text-xl">{statement.author}</h2>
            <span className="inline-block border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] border-line text-ink/60">
              {chapterLabel(statement.chapterSlug)}
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <ShareKit
            title={statement.title}
            url={`https://ligamahasiswa.vercel.app/chapters/${slug}/statements/${statementSlug}`}
          />
        </div>
      </section>

      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
