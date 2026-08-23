import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { JoinBand, NewsletterBand } from "@/components/sections";
import { CHAPTERS } from "@/lib/chapters";

const DIR = 27;

export default function ChaptersPage() {
  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Chapters"
        title="Our Chapters"
        sub="Every campus has its own voice. Find yours."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/chapters/${chapter.slug}`}
                className="group flex flex-col border border-line bg-cream p-6 hover:border-brand transition-colors"
              >
                <p className="display text-2xl leading-none">{chapter.short}</p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">
                  {chapter.tagline}
                </p>
                <span className="mono mt-5 text-[11px] uppercase tracking-[0.14em] text-ink/50 group-hover:text-brand transition-colors">
                  Visit chapter &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
