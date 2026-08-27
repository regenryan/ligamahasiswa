import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { Btn } from "@/components/sections/head";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { user } from "@/lib/schema";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";
import { SkeletonDetail } from "@/components/skeleton";

async function getMember(username: string) {
  try {
    const rows = await db.select().from(user).where(eq(user.userId, username));
    const row = rows[0] ?? null;
    if (!row) return null;
    return {
      id: row.userId ?? "",
      name: row.name ?? "",
      chapterSlug: "",
      role: "user",
      memberId: "",
      createdAt: row.createdAt ? String(row.createdAt) : "",
    };
  } catch {
    return null;
  }
}

async function MemberContent({ username }: { username: string }) {
  const member = await getMember(username);

  if (!member) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-[14px] text-ink/60">
          This member profile does not exist or is not yet verified.
        </p>
        <div className="mt-6">
          <Btn kind="ghost" href="/">Back to home</Btn>
        </div>
      </div>
    );
  }

  const initials = member.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  const isLeader = member.role !== "user";
  const roleLabel =
    member.role === "admin"
      ? "Admin"
      : member.role === "committee"
        ? "Campus Committee"
        : "Member";

  return (
    <>
      <PageHead
        kicker={`Member / ${member.chapterSlug.toUpperCase()}`}
        title={member.name}
        sub={roleLabel}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-start gap-6">
              <div className="halftone flex h-20 w-20 shrink-0 items-center justify-center border border-line bg-midnight">
                <span className="text-xl font-extrabold uppercase text-fog/60">
                  {initials}
                </span>
              </div>
              <div>
                <h2 className="display text-2xl">{member.name}</h2>
                <p className="mt-1 text-[14px] text-ink/60">
                  {chapterLabel(member.chapterSlug)}{" "}
                  chapter
                </p>
                {isLeader ? (
                  <span className="mt-2 inline-flex border border-brand/40 bg-brand/10 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-text">
                    {roleLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <div className="border border-line bg-cream p-5">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                Member details
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Member ID</p>
                  <p className="mono text-[13px]">{member.memberId}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Role</p>
                  <p className="text-[13px]">{roleLabel}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/40">Joined</p>
                  <p className="text-[13px]">
                    {member.createdAt
                      ? new Date(Number(member.createdAt)).toLocaleDateString("en-MY", {
                          year: "numeric",
                          month: "long",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <Shell dir={27}>
      <Suspense fallback={<SkeletonDetail />}>
        <MemberContent username={username} />
      </Suspense>
    </Shell>
  );
}
