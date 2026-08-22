import { Shell } from "@/components/shells";
import { Btn, NewsletterBand, PageHead } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { chapters as mockChapters, members as mockMembers } from "@/lib/mock";

const DIR = 27;

function getChapterData(slug: string) {
  return mockChapters.find((c) => c.slug === slug) ?? mockChapters[0];
}

async function getCommittee(slug: string) {
  try {
    const rows = await readSheet("Committee", { chapter: slug });
    if (rows.length > 0) {
      return rows.map((r) => ({
        name: r.name ?? "",
        role: r.title ?? "",
        email: r.email ?? "",
        chapterSlug: slug,
      }));
    }
  } catch {
    // fall through
  }
  return mockMembers
    .filter((m) => m.chapterSlug === slug)
    .map((m) => ({ name: m.name, role: m.role, email: "", chapterSlug: m.chapterSlug }));
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = getChapterData(slug);
  const team = await getCommittee(slug);
  const displayTeam = slug === "malaysia" && team.length === 0
    ? mockMembers.map((m) => ({ name: m.name, role: m.role, email: "", chapterSlug: m.chapterSlug }))
    : team;

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Team"
        title={`The ${ch.short} team`}
        sub="Names, roles, and short stories. Meet us at an event, not just on Instagram."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayTeam.map((m, i) => (
              <article key={`${m.name}-${i}`} className="border border-line bg-cream p-6">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{m.role}</p>
                <h3 className="mt-2 display text-xl">{m.name}</h3>
                {m.email ? <p className="mono mt-1 text-[12px] text-ink/40">{m.email}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-cream">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
                {ch.short} committee / seats open
              </p>
              <h2 className="display mt-3 text-3xl leading-none sm:text-4xl">Join the committee</h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink/70">
                Every chapter runs on volunteers. Bring your voice, your time, or just your willingness to show up and organize.
              </p>
            </div>
            <Btn kind="join" size="lg" href="/dashboard/card">
              Join the committee
            </Btn>
          </div>
        </div>
      </section>
      <NewsletterBand />
    </Shell>
  );
}
