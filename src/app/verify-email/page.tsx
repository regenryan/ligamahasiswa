"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/actions/email-verification";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<{ success?: string; error?: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setState({ error: "Invalid verification link." });
      return;
    }

    verifyEmailAction(token).then((result) => setState(result ?? null));
  }, [token]);

  return (
    <Shell dir={27}>
      <PageHead kicker="Account" title="Verify email" sub="Verifying your email address..." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 text-center">
          {state?.error ? (
            <>
              <p className="text-[14px] text-brand-text">{state.error}</p>
              <Link href="/login" className="mt-4 inline-block font-bold text-brand hover:underline">
                Go to login
              </Link>
            </>
          ) : state?.success ? (
            <>
              <p className="text-[14px] text-green-700">{state.success}</p>
              <Link href="/login" className="mt-4 inline-block font-bold text-brand hover:underline">
                Go to login
              </Link>
            </>
          ) : (
            <p className="text-[14px] text-ink/60">Verifying...</p>
          )}
        </div>
      </section>
    </Shell>
  );
}
