"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead, SectionHead } from "@/components/sections/head";
import { Reveal } from "@/components/interactive";
import { submitNomination } from "@/app/actions/prk";
import { CHAPTERS } from "@/lib/chapters";
import { Suspense } from "react";

function NominationForm() {
  const [state, action, pending] = useActionState(submitNomination, undefined);

  return (
    <Reveal>
      <div className="border border-line bg-cream p-6">
        <h3 className="display text-xl">Nominate a candidate</h3>
        <p className="mt-2 text-[13px] text-ink/60">
          Self-nominate or nominate someone you trust. All nominations are reviewed before appearing on the tracker.
        </p>
        {state?.error && (
          <div className="mt-4 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
            {state.error}
          </div>
        )}
        <form action={action} className="mt-6 space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prk-name" className="mb-1.5 block text-[13px] font-bold">Nominee name</label>
              <input id="prk-name" name="name" type="text" required placeholder="Full name" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50" />
            </div>
            <div>
              <label htmlFor="prk-email" className="mb-1.5 block text-[13px] font-bold">Contact email</label>
              <input id="prk-email" name="email" type="email" required placeholder="you@campus.edu.my" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prk-chapter" className="mb-1.5 block text-[13px] font-bold">Chapter</label>
              <select id="prk-chapter" name="chapter" required className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50">
                <option value="">Pick chapter...</option>
                {CHAPTERS.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="prk-position" className="mb-1.5 block text-[13px] font-bold">Position</label>
              <input id="prk-position" name="position" type="text" required placeholder="e.g. President, Secretary" className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50" />
            </div>
          </div>
          <div>
            <label htmlFor="prk-statement" className="mb-1.5 block text-[13px] font-bold">Platform / statement</label>
            <textarea id="prk-statement" name="statement" required minLength={10} rows={4} placeholder="What they stand for. At least 10 characters." className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-y" />
          </div>
          <button type="submit" disabled={pending} className="press w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50">
            {pending ? "Submitting..." : "Submit nomination"}
          </button>
        </form>
      </div>
    </Reveal>
  );
}

function PrkContent() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get("submitted") === "1";

  return (
    <>
      {submitted && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
          <div className="border border-term/50 bg-term/10 px-6 py-4 text-[14px] text-term">
            Nomination submitted. It will appear on the tracker once reviewed by the committee.
          </div>
        </div>
      )}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Nomination form" sub="Self-nominate or nominate someone you trust." />
          <div className="mt-8 max-w-2xl">
            <NominationForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default function PRKPage() {
  return (
    <Shell dir={27}>
      <PageHead
        kicker="Election"
        title="Campus Election"
        sub="Nominate yourself or someone you trust. Every campus deserves leadership that listens."
      />
      <Suspense fallback={null}>
        <PrkContent />
      </Suspense>
    </Shell>
  );
}
