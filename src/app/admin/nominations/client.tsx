"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { approveNomination, rejectNomination } from "../actions";

type NominationRow = {
  [key: string]: string;
};

function NominationActions({ nom }: { nom: NominationRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {nom.status === "pending" && (
        <>
          <button onClick={() => startTransition(async () => { await approveNomination(nom.id); router.refresh(); })} disabled={pending} className="border border-term/40 bg-term/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50">
            Approve
          </button>
          <button onClick={() => startTransition(async () => { await rejectNomination(nom.id); router.refresh(); })} disabled={pending} className="border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50">
            Reject
          </button>
        </>
      )}
      {nom.status !== "pending" && (
        <span className={`inline-flex border px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
          nom.status === "approved" ? "border-term/40 bg-term/10 text-term" : "border-brand/40 bg-brand/10 text-brand-text"
        }`}>{nom.status}</span>
      )}
      <Link href={`/admin/nominations/${nom.id}`} className="inline-flex border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] border-ink/40 bg-ink/10 text-ink hover:bg-ink/20 transition-colors">
        View
      </Link>
    </div>
  );
}

export default function AdminNominationsClient({ nominations }: { nominations: NominationRow[] }) {
  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="PRK nominations" sub="Review and approve election nominations." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          {nominations.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-[14px] text-ink/50">No nominations submitted.</p>
          ) : (
            <div className="space-y-3">
              {nominations.map((n) => (
                <div key={n.id} className="border border-line bg-cream p-4 sm:flex sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold">{n.name}</p>
                      <span className={`inline-flex border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                        n.status === "approved" ? "border-term/40 bg-term/10 text-term" :
                        n.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
                        "border-ink/20 bg-ink/5 text-ink/60"
                      }`}>{n.status}</span>
                    </div>
                    <p className="mono text-[12px] text-ink/50">{n.position} / {n.chapter_slug}</p>
                    <p className="mt-1 text-[13px] text-ink/60 line-clamp-1">{n.platform}</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <NominationActions nom={n} />
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
