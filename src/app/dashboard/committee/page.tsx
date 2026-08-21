import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { requireAuth } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";
import { CommitteeForm } from "./committee-form";

const DIR = 27;

export default async function CommitteePage() {
  const user = await requireAuth();

  if (!user) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Dashboard" title="Login required" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Please log in to manage your committee.</p>
            <Link
              href="/login"
              className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white"
            >
              Log in
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const isChairperson =
    user.role === "admin" || user.status === "approved";

  const chapters = ["Malaysia (national)", "UM", "UTM", "USM", "UniSZA", "SPARC UTeM"];
  const committees: Record<string, { title: string; name: string; email: string }[]> = {};

  for (const ch of chapters) {
    const rows = await readSheet("Committee", { chapter: ch });
    committees[ch] = rows.map((r) => ({
      title: r.title ?? "",
      name: r.name ?? "",
      email: r.email ?? "",
    }));
  }

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Dashboard"
        title="Committee"
        sub={isChairperson ? "Manage your chapter committee." : "View your chapter committee."}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
          {isChairperson ? (
            <CommitteeForm chapters={chapters} userChapter={user.chapterSlug} />
          ) : null}

          <div className="mt-10 space-y-8">
            {chapters.map((ch) => (
              <div key={ch}>
                <h3 className="display text-xl">{ch}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {committees[ch]?.map((m, i) => (
                    <div
                      key={`${ch}-${i}`}
                      className="border border-line bg-cream px-4 py-3"
                    >
                      <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                        {m.title}
                      </p>
                      <p className="mt-1 text-[14px] font-bold">{m.name}</p>
                      <p className="mono text-[12px] text-ink/40">{m.email}</p>
                    </div>
                  ))}
                  {(!committees[ch] || committees[ch].length === 0) ? (
                    <p className="text-[13px] text-ink/40">No members listed yet.</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
