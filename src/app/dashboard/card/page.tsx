import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { JoinBand } from "@/components/sections/strips";
import { getCurrentUser } from "@/lib/auth";
import { findRow } from "@/lib/sheets-db";
import Link from "next/link";
import { MemberCardClient } from "./member-card-client";
import { PerksGrid } from "./perks-grid";

export default async function CardPage() {
  const user = await getCurrentUser();

  let memberData = null;
  if (user) {
    const row = await findRow("Users", "id", user.id);
    if (row) {
      memberData = {
        name: row.name ?? "",
        role: row.role ?? "user",
        chapterSlug: row.chapter_slug ?? "",
        memberId: row.member_id ?? "",
        status: (row.status as string) ?? "pending",
        createdAt: row.created_at ?? "",
      };
    }
  }

  return (
    <Shell dir={27}>
      <PageHead
        kicker="Dashboard"
        title="Your member card"
        sub="Verification takes a few days. Your digital card is issued the moment you register."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Link
            href="/dashboard"
            className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors"
          >
            {"\u2190"} Back to dashboard
          </Link>
          {user && memberData ? (
            <MemberCardClient member={memberData} />
          ) : (
            <div className="mx-auto max-w-md text-center">
              <p className="text-[14px] text-ink/60">
                Please log in to view your member card.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="press inline-flex border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:opacity-90 transition-opacity duration-150"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="press inline-flex border border-line px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            index={2}
            title="What the card unlocks"
            sub="Four reasons to carry it. Membership is free, the perks are not."
          />
          <PerksGrid />
        </div>
      </section>
      <JoinBand />
    </Shell>
  );
}
