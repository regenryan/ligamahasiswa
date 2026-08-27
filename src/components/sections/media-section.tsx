import Link from "next/link";

export async function MediaSection() {
  const items: { id: string; type: string; title: string; url: string }[] = [];

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
        <div className="mt-8 border border-dashed border-line p-8 text-center">
          <p className="text-[14px] text-ink/50">No content available yet.</p>
        </div>
      </div>
    </section>
  );
}
