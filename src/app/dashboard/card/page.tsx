import { Shell } from "@/components/shells";
import { PageHead, SectionHead, Btn } from "@/components/sections/head";
import { JoinBand } from "@/components/sections/strips";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { user } from "@/lib/schema";
import Link from "next/link";
import { MemberCardClient } from "./member-card-client";
import { PerksGrid } from "./perks-grid";

export default async function CardPage() {
  const currentUser = await getCurrentUser();

  let memberData = null;
  if (currentUser) {
    const rows = await db.select().from(user).where(eq(user.userId, currentUser.id));
    const row = rows[0] ?? null;
    if (row) {
      memberData = {
        name: row.name ?? "",
        role: "user",
        chapterSlug: "",
        memberId: "",
        status: "pending",
        createdAt: row.createdAt ? String(row.createdAt) : "",
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
          {currentUser && memberData ? (
            <MemberCardClient member={memberData} />
          ) : (
            <div className="mx-auto max-w-md text-center">
              <p className="text-[14px] text-ink/60">
                Please log in to view your member card.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Btn kind="join" href="/login">Log in</Btn>
                <Btn kind="ghost" href="/register">Register</Btn>
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
