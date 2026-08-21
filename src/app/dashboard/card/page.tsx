"use client";

import { Suspense } from "react";
import { Shell } from "@/components/shells";
import { PageHead, Btn, SectionHead, JoinBand } from "@/components/sections";
import { Reveal, Tabs } from "@/components/interactive";
import { members } from "@/lib/mock";

const DIR = 27;

const QR_PATTERN: boolean[] = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
  if (corner) return !(r % 3 === 1 && c % 3 === 1);
  return ((r * 7 + c * 13) % 6) < 3;
});

const PERKS = [
  {
    title: "Member prices in the shop",
    body: "Discounted tees, pins and zines. Every ringgit funds the next campaign.",
  },
  {
    title: "Priority entry at assemblies",
    body: "Skip the queue at the door. Front rows are reserved for members.",
  },
  {
    title: "Vote in league decisions",
    body: "One member, one vote. You pick the campaigns and the direction.",
  },
  {
    title: "Member-only merch drops",
    body: "Hoodies and lanyards that never reach the public store.",
  },
];

const STEPS = [
  {
    title: "Register in 2 minutes",
    body: "Name, email and your chapter. No fees, no queues, no forms to the office.",
  },
  {
    title: "Committee verifies within days",
    body: "Your chapter committee checks your status. It usually takes 2 to 5 days.",
  },
  {
    title: "Card unlocks member prices and priority entry",
    body: "The moment your card is verified, every perk switches on.",
  },
];

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

function MemberCard() {
  const m = members[0];
  const initials = m.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden border border-fog/20 bg-midnight text-fog" style={{ aspectRatio: "85.6 / 53.98" }}>
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
            <p className="text-[14px] font-bold leading-tight text-fog">{m.name}</p>
            <p className="mt-0.5 text-[11px] text-fog/60">
              {m.role} / Malaysia
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {["Member", "Since 2024", "Active"].map((x) => (
            <div
              key={x}
              className="flex items-center justify-center border border-fog/15 bg-fog/5 px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.1em] text-fog/50"
            >
              {x}
            </div>
          ))}
        </div>
        <div className="mono flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-fog/40">
          <span>LMM-2026-0001</span>
          <span className="accent">Verified</span>
        </div>
      </div>
    </div>
  );
}

function MyCardPanel() {
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/50">
        Card 001 / issued
      </p>
      <MemberCard />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Btn kind="join" onClick={() => {}}>
          Share my card
        </Btn>
        <Btn kind="ghost">
          Download (demo)
        </Btn>
      </div>
      <p className="mono mt-5 text-center text-[11px] uppercase tracking-[0.14em] text-ink/50">
        One ID, one member. Present it at the door.
      </p>
    </div>
  );
}

function HowToJoinPanel() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="border border-line bg-cream p-6 sm:p-8">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
          How it works
        </p>
        <ol className="mt-6 space-y-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="accent shrink-0 text-[13px] font-extrabold">{i + 1}</span>
              <div>
                <h3 className="text-[15px] font-bold leading-snug">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <Btn kind="join" href="#join">
            Register now
          </Btn>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
            Membership is free. No fees, ever.
          </p>
        </div>
      </div>
    </div>
  );
}

function PerksSection() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={2}
            title="What the card unlocks"
            sub="Four reasons to carry it. Membership is free, the perks are not."
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <article className="flex h-full flex-col border border-line bg-cream p-6">
                <span className="accent text-[13px]">{"\u2713"}</span>
                <h3 className="mt-4 text-[15px] font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <PageHead
          kicker="Dashboard"
          title="Your member card"
          sub="Verification takes a few days. Your digital card is issued the moment you register."
        />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
            <Reveal>
              <Tabs
                labels={["My card", "How to join"]}
                tabs={[<MyCardPanel key="card" />, <HowToJoinPanel key="join" />]}
              />
            </Reveal>
          </div>
        </section>
        <PerksSection />
        <JoinBand />
      </Shell>
    </Suspense>
  );
}
