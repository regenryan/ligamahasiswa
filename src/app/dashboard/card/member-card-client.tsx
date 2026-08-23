"use client";

import { Btn } from "@/components/sections/head";
import { Reveal } from "@/components/interactive";
import { chapterLabel } from "@/lib/chapters";

const QR_PATTERN: boolean[] = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
  if (corner) return !(r % 3 === 1 && c % 3 === 1);
  return ((r * 7 + c * 13) % 6) < 3;
});

function QrBox() {
  return (
    <div aria-hidden="true" className="shrink-0 bg-fog p-1.5">
      <div className="grid grid-cols-9">
        {QR_PATTERN.map((on, i) => (
          <span
            key={i}
            className={on ? "bg-midnight" : "bg-fog"}
            style={{ width: "5px", height: "5px" }}
          />
        ))}
      </div>
    </div>
  );
}

interface MemberData {
  name: string;
  role: string;
  chapterSlug: string;
  memberId: string;
  status: string;
  createdAt: string;
}

export function MemberCardClient({ member }: { member: MemberData }) {
  const initials = member.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  const isActive = member.status === "active";
  const roleLabel =
    member.role === "admin"
      ? "Admin"
      : member.role === "national"
        ? "National"
        : member.role === "committee"
          ? "Committee"
          : member.role === "member"
            ? "Member"
            : "User";
  const chapter = chapterLabel(member.chapterSlug);
  const since = member.createdAt
    ? new Date(member.createdAt).getFullYear().toString()
    : "2026";

  return (
    <Reveal>
      <div className="mx-auto w-full max-w-md">
        <p className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/50">
          Card {member.memberId}
        </p>
        <div
          className="relative overflow-hidden border border-fog/20 bg-midnight text-fog"
          style={{ aspectRatio: "85.6 / 53.98" }}
        >
          <div className="flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="display text-xl text-fog">Liga Mahasiswa</p>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-fog/50">
                  Digital member card
                </p>
              </div>
              <QrBox />
            </div>
            <div className="my-3 h-px bg-fog/15" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-fog/20 bg-fog/10">
                <span className="text-[12px] font-extrabold uppercase text-fog/70">
                  {initials}
                </span>
              </div>
              <div>
                <p className="text-[14px] font-bold leading-tight text-fog">
                  {member.name}
                </p>
                <p className="mt-0.5 text-[11px] text-fog/60">
                  {roleLabel} / {chapter}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[roleLabel, `Since ${since}`, isActive ? "Active" : member.status === "expired" ? "Expired" : "Suspended"].map(
                (x) => (
                  <div
                    key={x}
                    className="flex items-center justify-center border border-fog/15 bg-fog/5 px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.1em] text-fog/50"
                  >
                    {x}
                  </div>
                ),
              )}
            </div>
            <div className="mono flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-fog/40">
              <span>{member.memberId}</span>
              <span className={isActive ? "accent" : ""}>
                {isActive ? "Verified" : member.status === "expired" ? "Expired" : "Suspended"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Btn kind="join" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            Share my card
          </Btn>
          <Btn kind="ghost">Download (demo)</Btn>
        </div>
        <p className="mono mt-5 text-center text-[11px] uppercase tracking-[0.14em] text-ink/50">
          One ID, one member. Present it at the door.
        </p>
      </div>
    </Reveal>
  );
}
