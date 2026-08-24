"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { CHAPTERS } from "@/lib/chapters";

export function ProfileForm({
  name,
  chapterSlug,
  phone,
}: {
  name: string;
  chapterSlug: string;
  phone: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, {
    ok: false,
  } satisfies ProfileState);

  return (
    <form action={action} className="space-y-4">
      {state.ok ? (
        <p className="mono border border-term/50 bg-term/10 px-4 py-3 text-[13px] text-term">
          Profile updated.
        </p>
      ) : null}
      {state.error ? (
        <p role="alert" className="mono text-[12px] text-brand-text">{state.error}</p>
      ) : null}
      <div>
        <label htmlFor="prof-name" className="mb-1.5 block text-[13px] font-bold">Name</label>
        <input id="prof-name" name="name" defaultValue={name} required className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none" />
      </div>
      <div>
        <label htmlFor="prof-chapter" className="mb-1.5 block text-[13px] font-bold">Chapter</label>
        <select id="prof-chapter" name="chapter" defaultValue={chapterSlug} className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none">
          {CHAPTERS.map((ch) => (
            <option key={ch.slug} value={ch.slug}>{ch.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="prof-phone" className="mb-1.5 block text-[13px] font-bold">Phone</label>
        <input id="prof-phone" name="phone" type="tel" defaultValue={phone} placeholder="+60..." className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none" />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="press w-full border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
