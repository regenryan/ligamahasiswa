"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestResetAction, type PasswordResetState } from "@/app/actions/password-reset";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestResetAction, undefined);

  return (
    <Shell dir={27}>
      <PageHead kicker="Account" title="Forgot password" sub="Enter your email to receive a reset link." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
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
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-[13px] font-bold">
                Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                placeholder="you@campus.edu.my"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div className="pt-2">
              <Btn kind="join" className="w-full" type="submit">
                {pending ? "Sending..." : "Send reset link"}
              </Btn>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink/50">
            <Link href="/login" className="font-bold text-brand hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </section>
    </Shell>
  );
}
