"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { SkeletonGrid } from "@/components/skeleton";

const DIR = 27;

function SuccessInner() {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Shop" title="Payment successful" />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
          <div className="border border-term/50 bg-term/10 px-6 py-10">
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-term">Confirmed</p>
            <h1 className="display mt-4 text-4xl text-term sm:text-5xl">Thank you</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              Your payment has been received. The movement funds itself.
            </p>
            {ref && (
              <p className="mono mt-4 text-[11px] uppercase tracking-[0.14em] text-ink/40">
                Reference: {ref}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Btn kind="act" href="/shop">Back to shop</Btn>
              <Btn kind="ghost" href="/">Home</Btn>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <SuccessInner />
    </Suspense>
  );
}
