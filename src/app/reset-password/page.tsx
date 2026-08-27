"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction, type PasswordResetState } from "@/app/actions/password-reset";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <Shell dir={27}>
      <PageHead kicker="Account" title="Reset password" sub="Enter your new password below." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
          {!token ? (
            <div className="text-center">
              <p className="text-[14px] text-ink/60">Invalid or missing reset link.</p>
              <Link href="/forgot-password" className="mt-4 inline-block font-bold text-brand hover:underline">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              {state?.error ? (
                <div className="mb-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
                  {state.error}
                </div>
              ) : null}
              {state?.success ? (
                <div className="mb-6 border border-green-500/40 bg-green-500/10 px-4 py-3 text-[13px] text-green-700">
                  {state.success}
                </div>
              ) : null}

              <form action={action} className="space-y-4" noValidate>
                <input type="hidden" name="token" value={token} />

                <div>
                  <label htmlFor="reset-password" className="mb-1.5 block text-[13px] font-bold">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>

                <div className="pt-2">
                  <Btn kind="join" className="w-full" type="submit">
                    {pending ? "Resetting..." : "Reset password"}
                  </Btn>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </Shell>
  );
}
