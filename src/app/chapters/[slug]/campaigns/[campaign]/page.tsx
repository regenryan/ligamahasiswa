"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { Shell } from "@/components/shells";
import {
  PageHead,
  Btn,
  SectionHead,
  Countdown,
  AukuYears,
  StatusChip,
  CampaignSection,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { Reveal, Accordion } from "@/components/interactive";
import { Placeholder } from "@/components/Placeholder";
import { ShareKit } from "@/components/ShareKit";
import { getCampaign, getChapter, campaigns, type Campaign } from "@/lib/mock";

const DIR = 27;

function Demands({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((d) => (
        <li key={d} className="flex items-start gap-4 border border-line bg-cream p-5">
          <span className="accent mt-2 shrink-0 text-[14px]" aria-hidden="true">
            {"\u2022"}
          </span>
          <span className="text-[15px] leading-relaxed text-ink/80">{d}</span>
        </li>
      ))}
    </ol>
  );
}

function ActRow() {
  return (
    <section className="border-b border-line bg-midnight">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 border border-line bg-cream p-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
            One tap away
          </p>
          <div className="flex flex-wrap gap-3">
            <Btn kind="act" href="/shop">
              Donate to this campaign
            </Btn>
            <Btn kind="act" href="#join">
              Volunteer
            </Btn>
            <Btn kind="join" href="/dashboard/card">
              Join the movement
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBlock({ campaign }: { campaign: Campaign }) {
  const isAuku = campaign.slug === "mansuh-auku";
  return (
    <section className="border-b border-line">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <StatusChip status={campaign.status} />
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink/80">
            {campaign.summary}
          </p>
          <div className="mt-8 max-w-md">
            <Countdown label="Next assembly" />
          </div>
          {isAuku ? (
            <div className="mt-6">
              <AukuYears />
            </div>
          ) : null}
        </div>
        <Placeholder
          ratio="16/9"
          caption={
            isAuku
              ? "Archive photo: students at the Mansuh AUKU rally"
              : `Archive photo: the ${campaign.title} campaign`
          }
          label="archive / photo"
          className="w-full"
        />
      </div>
    </section>
  );
}

function NextSteps() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead index={4} title="What happens next" />
          <div className="space-y-4">
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75">
              The next rally is scheduled for Dataran Merdeka on November 14. Red shirts,
              banners, and one demand: a written timeline for abolition, in black and
              white.
            </p>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75">
              While the streets speak, we push through the doors. We are asking for a
              meeting with the ministry so students sit at the table when the new campus
              law is drafted.
            </p>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75">
              Every chapter runs a monthly assembly. That is where the campaign is
              planned, the next move is chosen, and the people who carry it to Parliament
              are found.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function CampaignPage() {
  const params = useParams<{ slug: string; campaign: string }>();
  const { slug, campaign: campaignSlug } = params;
  const chapter = getChapter(slug);
  const campaign = getCampaign(slug, campaignSlug);
  const related = campaigns.filter((c) => c.slug !== campaign.slug);
  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <PageHead kicker={chapter.name} title={campaign.title} />
        <HeroBlock campaign={campaign} />
        <ActRow />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <SectionHead index={2} title="The demands" />
              <Demands items={campaign.demands} />
            </Reveal>
          </div>
        </section>
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <Reveal>
              <SectionHead index={3} title="Timeline" />
              <Accordion
                items={campaign.timeline.map((t) => ({ title: t.date, body: t.text }))}
              />
            </Reveal>
          </div>
        </section>
        <NextSteps />
        <CampaignSection items={related} headline="Related campaigns" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <ShareKit title={campaign.title} url={`https://ligamahasiswa.vercel.app/chapters/${slug}/campaigns/${campaignSlug}`} />
          </div>
        </section>
        <JoinBand />
        <NewsletterBand />
      </Shell>
    </Suspense>
  );
}
