import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { readSheet } from "@/lib/sheets-db";

async function getNominations() {
  try {
    const rows = await readSheet("PRK_Nominations");
    return rows.map((r) => ({
      id: r.id ?? "",
      userId: r.user_id ?? "",
      chapterSlug: r.chapter_slug ?? "",
      position: r.position ?? "",
      statement: r.statement ?? "",
      status: r.status ?? "pending",
    }));
  } catch {
    return [];
  }
}

export default async function PRKPage() {
  const nominations = await getNominations();
  const approved = nominations.filter((n) => n.status === "approved");

  return (
    <Shell dir={27}>
      <PageHead
        kicker="PRK"
        title="Pilihan Raya Kampus"
        sub="Campus elections. Nominate yourself or someone you trust."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Candidates" sub="Approved nominations for campus elections." />
          {approved.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">
                Nominations open soon. Check back later.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {approved.map((n) => (
                <article key={n.id} className="border border-line bg-cream p-6">
                  <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                    {n.chapterSlug === "malaysia" ? "National" : n.chapterSlug.toUpperCase()}
                  </span>
                  <h3 className="mt-2 display text-xl">{n.position}</h3>
                  <p className="mt-2 text-[13px] text-ink/60 line-clamp-3">{n.statement}</p>
                  <span className="mt-3 inline-flex border border-term/40 bg-term/10 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term">
                    Approved
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
