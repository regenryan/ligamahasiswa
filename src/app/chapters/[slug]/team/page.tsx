"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { Shell } from "@/components/shells";
import { Btn, NewsletterBand, PageHead, MemberCard } from "@/components/sections";
import { Reveal } from "@/components/interactive";
import { getChapter, members as allMembers } from "@/lib/mock";

const DIR = 27;

function CommitteeCta({ short }: { short: string }) {
  return (
    <section className="border-b border-line bg-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
                {short} committee / seats open
              </p>
              <h2 className="display mt-3 text-3xl leading-none sm:text-4xl">
                Join the committee
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink/70">
                Every chapter runs on volunteers. Bring your voice, your time, or
                just your willingness to show up and organize.
              </p>
            </div>
            <Btn kind="join" size="lg" href="/dashboard/card">
              Join the committee
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TeamInner() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const ch = getChapter(slug);
  const matches = allMembers.filter((m) => m.chapterSlug === slug);
  const team =
    slug === "malaysia" ? allMembers : matches.length > 0 ? matches : allMembers;
  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Team"
        title={`The ${ch.short} team`}
        sub="Names, roles, and short stories. Meet us at an event, not just on Instagram."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={(i % 3) * 60}>
                <MemberCard m={m} label={ch.short} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CommitteeCta short={ch.short} />
      <NewsletterBand />
    </Shell>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={null}>
      <TeamInner />
    </Suspense>
  );
}
