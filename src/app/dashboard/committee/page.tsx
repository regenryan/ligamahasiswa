import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections";
import { requireAuth, hasRole } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";
import { CommitteeForm } from "./committee-form";
import { CommitteeActions } from "./committee-actions";

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
            <Link href="/login" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Log in
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const isAdmin = user.role === "admin";
  const isCommitteeMember = hasRole(user.role, "committee");

  const chapters: { slug: string; label: string }[] = [
    { slug: "malaysia", label: "Malaysia (national)" },
    { slug: "um", label: "UM" },
    { slug: "utm", label: "UTM" },
    { slug: "usm", label: "USM" },
    { slug: "unisza", label: "UniSZA" },
    { slug: "utem", label: "SPARC UTeM" },
  ];

  const committees: Record<string, { title: string; name: string; email: string; id: string; user_id: string; status: string }[]> = {};
  const chapterStats: Record<string, { campaigns: number; events: number; statements: number }> = {};

  const visibleChapters = isAdmin ? chapters : chapters.filter((ch) => ch.slug === user.chapterSlug);

  for (const ch of visibleChapters) {
    const [campRows, evtRows, stmtRows, commRows] = await Promise.all([
      readSheet("Campaigns", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("Events", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("Statements", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("CommitteePositions", { chapter: ch.slug, status: "active" }).catch(() => []),
    ]);
    committees[ch.slug] = commRows.map((r) => ({
      title: r.title ?? "",
      name: r.name ?? "",
      email: r.email ?? "",
      id: r.id ?? "",
      user_id: r.user_id ?? "",
      status: r.status ?? "active",
    }));
    chapterStats[ch.slug] = {
      campaigns: campRows.length,
      events: evtRows.length,
      statements: stmtRows.length,
    };
  }

  const pendingApprovals = isCommitteeMember || isAdmin
    ? await readSheet("CommitteeApprovals", { status: "pending" }).catch(() => [])
    : [];

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Dashboard"
        title="Committee"
        sub={isAdmin ? "Manage chapter committees, approvals, and content." : "View your chapter committee and content."}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
          {isAdmin ? (
            <CommitteeForm chapters={chapters} userChapter={user.chapterSlug} />
          ) : null}

          {isCommitteeMember && (
            <div className="mt-10">
              <SectionHead index={0} title="My positions" sub="Your committee positions in this chapter." />
              <div className="mt-4 space-y-2">
                {visibleChapters.flatMap((ch) =>
                  (committees[ch.slug] ?? [])
                    .filter((m) => m.user_id === user.id)
                    .map((m) => (
                      <div key={m.id} className="flex items-center justify-between border border-line bg-cream px-5 py-3">
                        <div>
                          <p className="text-[14px] font-bold capitalize">{m.title.replace(/_/g, " ")}</p>
                          <p className="mono text-[12px] text-ink/50">{ch.label}</p>
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-term">Active</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {pendingApprovals.length > 0 && (isCommitteeMember || isAdmin) && (
            <div className="mt-10">
              <SectionHead index={1} title="Pending approvals" sub="Resignation requests awaiting approval." />
              <CommitteeActions
                approvals={pendingApprovals.map((a) => ({
                  id: a.id,
                  type: a.type,
                  requesterId: a.requester_id,
                  payload: a.payload,
                  approverIds: a.approver_ids,
                }))}
                currentUserId={user.id}
                isAdmin={isAdmin}
              />
            </div>
          )}

          <div className="mt-10 space-y-8">
            <SectionHead index={2} title="Committee members" sub="The people leading each chapter." />
            {visibleChapters.map((ch) => (
              <div key={ch.slug}>
                <h3 className="display text-xl">{ch.label}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {committees[ch.slug]?.map((m) => (
                    <div key={m.id} className="border border-line bg-cream px-4 py-3">
                      <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{m.title.replace(/_/g, " ")}</p>
                      <p className="mt-1 text-[14px] font-bold">{m.name}</p>
                      <p className="mono text-[12px] text-ink/40">{m.email}</p>
                    </div>
                  ))}
                  {(!committees[ch.slug] || committees[ch.slug].length === 0) ? (
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
