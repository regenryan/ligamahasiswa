"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <Shell dir={27}>
      <PageHead kicker="Account" title="Log in" sub="Access your Liga Mahasiswa account." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
          {state?.error ? (
            <div className="mb-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
              {state.error}
            </div>
          ) : null}

          <form action={action} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-bold">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                placeholder="you@campus.edu.my"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-bold">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                placeholder="Your password"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div className="pt-2">
              <Btn kind="join" className="w-full" type="submit">
                {pending ? "Logging in..." : "Log in"}
              </Btn>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink/50">
            No account yet?{" "}
            <Link href="/register" className="font-bold text-brand hover:underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    </Shell>
  );
}
