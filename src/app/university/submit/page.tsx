"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitUniversity, type UniversityState } from "@/app/actions/university";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

export default function SubmitUniversityPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<UniversityState, FormData>(submitUniversity, undefined);

  useEffect(() => {
    if (state?.ok) {
      router.push("/university/submit/success");
    }
  }, [state, router]);

  return (
    <Shell dir={27}>
      <PageHead kicker="Universities" title="Submit a University" sub="Bring the movement to your campus." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-[13px] font-bold">
                University Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Universiti Malaya"
                required
                className="w-full border border-line bg-paper px-4 py-3 text-[14px] focus:border-brand focus:outline-none"
              />
              <p className="mt-2 text-[12px] text-ink/60">
                Please use the full official name.
              </p>
            </div>
            
            {state?.error && (
              <p className="text-[13px] text-brand-text">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="press w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Submit for Approval"}
            </button>
          </form>
        </div>
      </section>
    </Shell>
  );
}