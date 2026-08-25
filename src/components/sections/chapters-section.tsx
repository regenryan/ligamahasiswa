import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";

export function ChaptersSection() {
  const chapters = CHAPTERS.filter((c) => c.slug !== "ligamy");

  return (
    <section className="border-b border-line" id="chapters">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Where we are</p>
            <h2 className="display mt-2 text-3xl sm:text-5xl">Chapters</h2>
          </div>
          <Link href="/chapters" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => (
            <Link
              key={ch.slug}
              href={`/chapters/${ch.slug}`}
              className="group border border-line bg-cream p-6 hover:border-brand transition-colors"
            >
              <p className="display text-2xl">{ch.short}</p>
              <p className="mt-2 text-[14px] text-ink/60">{ch.tagline}</p>
              <p className="mono mt-4 text-[11px] uppercase tracking-[0.14em] text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                View chapter →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
