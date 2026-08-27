"use client";

import { Btn, AukuYears } from "@/components/sections/head";
import { Reveal } from "@/components/interactive";
import type { CampaignData } from "@/lib/queries";

type HeroProps = {
  chapterName: string;
  campaign: CampaignData | undefined;
};

export function Hero({ chapterName, campaign }: HeroProps) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <Reveal>
          <div className="mono flex flex-wrap items-center justify-center gap-3 border border-line bg-cream px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink/60">
            <span className="flex items-center gap-2">
              <span className="metro-dot inline-block h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              {chapterName.toUpperCase()}
            </span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">Liga Mahasiswa</span>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-center text-center">
          <Reveal delay={100}>
            <p className="mono text-[12px] uppercase tracking-[0.2em] accent">Abolish AUKU</p>
            <h1 className="display mt-4 text-4xl leading-[0.88] sm:text-5xl lg:text-6xl xl:text-7xl">{campaign?.name}</h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-ink/70">{campaign?.summary}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn kind="join" href="/register" size="lg">
                Join the movement
              </Btn>
              <Btn kind="act" href="/campaigns" size="lg">
                See our campaigns
              </Btn>
            </div>
          </Reveal>
        </div>

        <Reveal delay={400}>
          <div className="mx-auto mt-16 flex max-w-xl flex-wrap items-center justify-center gap-6 border-t border-line pt-8">
            <div className="text-center">
              <AukuYears />
            </div>
            <div className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <div className="text-center">
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Active chapters</p>
              <p className="display mt-1 text-2xl">6</p>
            </div>
            <div className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <div className="text-center">
              <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">Membership</p>
              <p className="display mt-1 text-2xl">RM10</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
