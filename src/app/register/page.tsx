"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/app/actions/auth";
import { CHAPTERS } from "@/lib/chapter-constants";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

function FieldError({ name, state }: { name: string; state: AuthState }) {
  const msg = state?.fieldErrors?.[name];
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-[12px] text-brand-text">
      {msg}
    </p>
  );
}

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <Shell dir={27}>
      <PageHead kicker="Account" title="Register" sub="Create your Liga Mahasiswa account. Membership is RM10." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
          {state?.error ? (
            <div className="mb-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
              {state.error}
            </div>
          ) : null}

          <form action={action} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-name" className="mb-1.5 block text-[13px] font-bold">
                Full name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                minLength={3}
                placeholder="Nur Aisyah Binti Ahmad"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
              <FieldError name="name" state={state} />
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-[13px] font-bold">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                placeholder="you@campus.edu.my"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
              <FieldError name="email" state={state} />
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-[13px] font-bold">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
              <FieldError name="password" state={state} />
            </div>

            <div>
              <label htmlFor="reg-phone" className="mb-1.5 block text-[13px] font-bold">
                Phone (optional)
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                placeholder="012-345 6789"
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div>
              <label htmlFor="reg-chapter" className="mb-1.5 block text-[13px] font-bold">
                Chapter
              </label>
              <select
                id="reg-chapter"
                name="chapter"
                required
                className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="">Pick your chapter...</option>
                {CHAPTERS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
              <FieldError name="chapter" state={state} />
            </div>

            <div className="pt-2">
              <Btn kind="join" className="w-full" type="submit">
                {pending ? "Creating account..." : "Create account"}
              </Btn>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink/50">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-brand hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </Shell>
  );
}
