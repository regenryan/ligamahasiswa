import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections/head";
import { Btn } from "@/components/sections/head";
import { findRow } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import Link from "next/link";

async function getMember(username: string) {
  try {
    const row = await findRow("Users", "id", username);
    if (!row || row.status !== "approved") return null;
    return {
      id: row.id ?? "",
      name: row.name ?? "",
      chapterSlug: row.chapter_slug ?? "",
      role: row.role ?? "user",
      memberId: row.member_id ?? "",
      createdAt: row.created_at ?? "",
    };
  } catch {
    return null;
  }
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const member = await getMember(username);

  if (!member) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Profile" title="Member not found" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-[14px] text-ink/60">
            This member profile does not exist or is not yet verified.
          </p>
          <div className="mt-6">
            <Btn kind="ghost" href="/">Back to home</Btn>
          </div>
        </div>
      </Shell>
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
    <Shell dir={27}>
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
                      ? new Date(member.createdAt).toLocaleDateString("en-MY", {
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
    </Shell>
  );
}
