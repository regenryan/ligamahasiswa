"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { approveUniversity, rejectUniversity } from "@/app/actions/admin-university";

type UniRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  date: string;
};

export function AdminUniversitiesClient({ universities }: { universities: UniRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Universities" sub="Approve or reject university submissions." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-line bg-cream">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Slug</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {universities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                      No universities found.
                    </td>
                  </tr>
                ) : (
                  universities.map((uni) => (
                    <tr key={uni.id}>
                      <td className="px-4 py-3">{uni.name}</td>
                      <td className="px-4 py-3 mono text-[12px]">{uni.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                          uni.status === "active" ? "border-term/40 bg-term/10 text-term" :
                          uni.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
                          "border-ink/20 bg-ink/5 text-ink/60"
                        }`}>{uni.status}</span>
                      </td>
                      <td className="px-4 py-3 mono text-[12px] text-ink/60">{uni.date}</td>
                      <td className="px-4 py-3">
                        {uni.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startTransition(async () => { await approveUniversity(uni.id); router.refresh(); })}
                              disabled={pending}
                              className="border border-term/40 bg-term/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => startTransition(async () => { await rejectUniversity(uni.id); router.refresh(); })}
                              disabled={pending}
                              className="border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Shell>
  );
}