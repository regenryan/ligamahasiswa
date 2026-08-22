"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { approveZine, rejectZine } from "../actions";

type ZineRow = {
  [key: string]: string;
};

function ZineActions({ zine }: { zine: ZineRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {zine.status === "pending" && (
        <>
          <button onClick={() => startTransition(async () => { await approveZine(zine.slug); router.refresh(); })} disabled={pending} className="border border-term/40 bg-term/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50">
            Approve
          </button>
          <button onClick={() => startTransition(async () => { await rejectZine(zine.slug); router.refresh(); })} disabled={pending} className="border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50">
            Reject
          </button>
        </>
      )}
      {zine.status !== "pending" && (
        <span className={`inline-flex border px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
          zine.status === "approved" ? "border-term/40 bg-term/10 text-term" : "border-brand/40 bg-brand/10 text-brand-text"
        }`}>{zine.status}</span>
      )}
    </div>
  );
}

export default function AdminZinesClient({ zines }: { zines: ZineRow[] }) {
  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Zine approval" sub="Review and approve zine submissions." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          {zines.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No zine submissions.</p>
          ) : (
            <div className="space-y-3">
              {zines.map((z) => (
                <div key={z.slug} className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold truncate">{z.title}</p>
                      <span className={`inline-flex border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                        z.status === "approved" ? "border-term/40 bg-term/10 text-term" :
                        z.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
                        "border-ink/20 bg-ink/5 text-ink/60"
                      }`}>{z.status}</span>
                    </div>
                    <p className="mono text-[12px] text-ink/50">{z.author} / {z.chapter_slug}</p>
                    <p className="mt-1 text-[13px] text-ink/60 line-clamp-1">{z.excerpt}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <ZineActions zine={z} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
