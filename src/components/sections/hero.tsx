"use client";

import { Btn, Countdown, AukuYears } from "@/components/sections/head";
import { Reveal } from "@/components/interactive";
import type { Campaign } from "@/lib/mock";

type HeroProps = {
  chapterName: string;
  campaign: Campaign;
};

export function Hero({ chapterName, campaign }: HeroProps) {
  const demands = campaign.demands;

  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-0 sm:px-6 sm:pb-20">
        <Reveal>
          <div className="mono flex flex-wrap items-center justify-center gap-3 border border-line bg-cream px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink/60">
            <span className="flex items-center gap-2">
              <span className="metro-dot inline-block h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              {chapterName.toUpperCase()}
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">Liga Mahasiswa</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="accent">Active campaign</span>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center text-center">
          <Reveal delay={100}>
            <p className="mono text-[12px] uppercase tracking-[0.2em] accent">Abolish AUKU</p>
            <h1 className="display mt-4 text-4xl leading-[0.9] sm:text-5xl lg:text-6xl xl:text-7xl">{campaign.title}</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-ink/70">{campaign.summary}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn kind="join" href="/dashboard/card" size="lg">
                Join the movement
              </Btn>
              <Btn kind="act" href="/campaigns" size="lg">
                See our campaigns
              </Btn>
            </div>
          </Reveal>
        </div>

        <Reveal delay={350}>
          <div className="mx-auto mt-14 max-w-xl">
            <Countdown label="Next assembly" />
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mx-auto mt-6 max-w-xl text-center">
            <AukuYears />
          </div>
        </Reveal>

        <Reveal delay={450}>
          <ul className="mx-auto mt-12 grid max-w-xl gap-2">
            {demands.map((demand, i) => (
              <Reveal key={demand} delay={450 + i * 80}>
                <li className="flex items-baseline gap-3 border-b border-ink/25 pb-2 text-[14px]">
                  <span className="mono inline-flex h-6 w-6 shrink-0 items-center justify-center bg-brand text-[11px] font-bold text-paper">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink/80">{demand}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
