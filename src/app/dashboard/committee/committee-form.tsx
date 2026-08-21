"use client";

import { useState } from "react";
import { writeSheet } from "@/lib/sheets-db";

export function CommitteeForm({
  chapters,
  userChapter,
}: {
  chapters: string[];
  userChapter: string;
}) {
  const [chapter, setChapter] = useState(userChapter);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Enter the committee title."); return; }
    if (!name.trim()) { setError("Enter the member name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setError(null);
    setSending(true);

    const result = await writeSheet("Committee", {
      id: `comm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      chapter,
      title: title.trim(),
      name: name.trim(),
      email: email.trim(),
      created_at: new Date().toISOString(),
    });

    setSending(false);

    if (result.ok) {
      setSuccess(true);
      setTitle("");
      setName("");
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error ?? "Failed to add. Try again.");
    }
  };

  return (
    <div className="border border-line bg-cream p-5">
      <h3 className="display text-lg">Add committee member</h3>
      <p className="mt-1 text-[13px] text-ink/50">
        Only chairpersons can add or update committee entries.
      </p>

      {error ? (
        <div className="mt-4 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mt-4 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          Committee member added.
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="comm-chapter" className="mb-1 block text-[12px] font-bold">Chapter</label>
          <select
            id="comm-chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] focus:outline-none"
          >
            {chapters.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comm-title" className="mb-1 block text-[12px] font-bold">Title</label>
          <input
            id="comm-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chairperson, Secretary..."
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/35 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="comm-name" className="mb-1 block text-[12px] font-bold">Name</label>
          <input
            id="comm-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/35 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="comm-email" className="mb-1 block text-[12px] font-bold">Email</label>
          <input
            id="comm-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@campus.edu.my"
            className="w-full border border-line bg-midnight px-3 py-2.5 text-[13px] placeholder:text-ink/35 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={sending}
        className="press mt-4 border border-2 border-ink bg-brand px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white disabled:opacity-50"
      >
        {sending ? "Adding..." : "Add member"}
      </button>
    </div>
  );
}
