import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections";
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
            <Link href="/login" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Log in
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const isAdmin = user.role === "admin";
  const isCommittee = user.role === "committee" || isAdmin;

  const chapters: { slug: string; label: string }[] = [
    { slug: "malaysia", label: "Malaysia (national)" },
    { slug: "um", label: "UM" },
    { slug: "utm", label: "UTM" },
    { slug: "usm", label: "USM" },
    { slug: "unisza", label: "UniSZA" },
    { slug: "utem", label: "SPARC UTeM" },
  ];

  const committees: Record<string, { title: string; name: string; email: string }[]> = {};
  const chapterStats: Record<string, { campaigns: number; events: number; statements: number }> = {};

  const visibleChapters = isAdmin ? chapters : chapters.filter((ch) => ch.slug === user.chapterSlug);

  for (const ch of visibleChapters) {
    const [campRows, evtRows, stmtRows, commRows] = await Promise.all([
      readSheet("Campaigns", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("Events", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("Statements", { chapter_slug: ch.slug }).catch(() => []),
      readSheet("Committee", { chapter: ch.slug }).catch(() => []),
    ]);
    committees[ch.slug] = commRows.map((r) => ({
      title: r.title ?? "",
      name: r.name ?? "",
      email: r.email ?? "",
    }));
    chapterStats[ch.slug] = {
      campaigns: campRows.length,
      events: evtRows.length,
      statements: stmtRows.length,
    };
  }

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Dashboard"
        title="Committee"
        sub={isAdmin ? "Manage your chapter committee and content." : "View your chapter committee and content."}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
          {isAdmin ? (
            <CommitteeForm chapters={chapters} userChapter={user.chapterSlug} />
          ) : null}

          {isCommittee ? (
            <div className="mt-10">
              <SectionHead index={0} title="Your chapter content" sub={`Manage campaigns, events, and statements for ${user.chapterSlug === "malaysia" ? "the national level" : user.chapterSlug.toUpperCase()}.`} />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href={`/chapters/${user.chapterSlug}/campaigns`} className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Campaigns</p>
                  <p className="display mt-1 text-2xl">{chapterStats[user.chapterSlug]?.campaigns ?? 0}</p>
                  <span className="mt-2 inline-flex text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text">View all</span>
                </Link>
                <Link href={`/chapters/${user.chapterSlug}/events`} className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Events</p>
                  <p className="display mt-1 text-2xl">{chapterStats[user.chapterSlug]?.events ?? 0}</p>
                  <span className="mt-2 inline-flex text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text">View all</span>
                </Link>
                <Link href={`/chapters/${user.chapterSlug}/statements`} className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Statements</p>
                  <p className="display mt-1 text-2xl">{chapterStats[user.chapterSlug]?.statements ?? 0}</p>
                  <span className="mt-2 inline-flex text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text">View all</span>
                </Link>
                <Link href={`/chapters/${user.chapterSlug}/gallery`} className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">Gallery</p>
                  <p className="display mt-1 text-2xl">{"--"}</p>
                  <span className="mt-2 inline-flex text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text">View all</span>
                </Link>
              </div>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="mt-10">
              <SectionHead index={1} title="Admin shortcuts" sub="Quick access to approval workflows." />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link href="/admin/users" className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="display text-lg">User approvals</p>
                  <p className="mt-1 text-[13px] text-ink/60">Approve or reject member applications</p>
                </Link>
                <Link href="/admin/zines" className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="display text-lg">Zine approvals</p>
                  <p className="mt-1 text-[13px] text-ink/60">Review pending zine submissions</p>
                </Link>
                <Link href="/admin/nominations" className="border border-line bg-cream p-5 hover:border-brand transition-colors">
                  <p className="display text-lg">PRK nominations</p>
                  <p className="mt-1 text-[13px] text-ink/60">Approve or reject nominations</p>
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-10 space-y-8">
            <SectionHead index={2} title="Committee members" sub="The people leading each chapter." />
            {visibleChapters.map((ch) => (
              <div key={ch.slug}>
                <h3 className="display text-xl">{ch.label}</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {committees[ch.slug]?.map((m, i) => (
                    <div key={`${ch}-${i}`} className="border border-line bg-cream px-4 py-3">
                      <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{m.title}</p>
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
