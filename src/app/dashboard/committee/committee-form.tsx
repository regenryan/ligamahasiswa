"use client";

import { useActionState } from "react";
import { addCommitteeMember } from "@/app/actions/committee";

export function CommitteeForm({
  chapters,
  userChapter,
}: {
  chapters: { slug: string; label: string }[];
  userChapter: string;
}) {
  const [state, action, pending] = useActionState(addCommitteeMember, undefined);

  return (
    <div className="border border-line bg-cream p-5">
      <h3 className="display text-lg">Add committee member</h3>
      <p className="mt-1 text-[13px] text-ink/50">
        Only admins can add committee entries.
      </p>

      {state?.error ? (
        <div className="mt-4 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="mt-4 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          Committee member added.
        </div>
      ) : null}

      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="comm-chapter" className="mb-1 block text-[12px] font-bold">Chapter</label>
          <select
            id="comm-chapter"
            name="chapter"
            defaultValue={userChapter}
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] focus:outline-none"
          >
            {chapters.map((ch) => (
              <option key={ch.slug} value={ch.slug}>{ch.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comm-title" className="mb-1 block text-[12px] font-bold">Title</label>
          <input
            id="comm-title"
            name="title"
            placeholder="Chairperson, Secretary..."
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/40 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="comm-name" className="mb-1 block text-[12px] font-bold">Name</label>
          <input
            id="comm-name"
            name="name"
            placeholder="Full name"
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/40 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="comm-email" className="mb-1 block text-[12px] font-bold">Email</label>
          <input
            id="comm-email"
            name="email"
            type="email"
            placeholder="email@campus.edu.my"
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/40 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="press border border-2 border-ink bg-brand px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-paper disabled:opacity-50"
          >
            {pending ? "Adding..." : "Add member"}
          </button>
        </div>
      </form>
    </div>
  );
}
