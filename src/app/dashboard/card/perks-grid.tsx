"use client";

import { Reveal } from "@/components/interactive";

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

export function PerksGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PERKS.map((p, i) => (
        <Reveal key={p.title} delay={i * 60}>
          <article className="flex h-full flex-col border border-line bg-cream p-6">
            <span className="accent text-[13px]">{"\u2713"}</span>
            <h3 className="mt-4 text-[15px] font-bold leading-snug">
              {p.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
              {p.body}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
