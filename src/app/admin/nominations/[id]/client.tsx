"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { approveNomination, rejectNomination, addNominationNote } from "@/app/admin/actions";

type NoteRow = {
  id: string;
  comment: string;
  verdict: string | null;
  contactStatus: string | null;
  createdAt: string;
  authorName: string;
};

type NomData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  chapter: string;
  status: string;
  justification: string;
  createdAt: string;
};

export function NominationDetailClient({ nomination, notes }: { nomination: NomData, notes: NoteRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [comment, setComment] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setAddingNote(true);
    await addNominationNote(nomination.id, comment);
    setComment("");
    setAddingNote(false);
    router.refresh();
  };

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin / Nominations" title={nomination.name} sub={`Status: ${nomination.status}`} />
      
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin/nominations" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to nominations
          </Link>

          <div className="grid gap-10 md:grid-cols-[1fr_400px]">
            <div>
              <h3 className="display text-2xl mb-4">Nominee Details</h3>
              <div className="border border-line bg-cream p-6 space-y-4">
                <div>
                  <p className="text-[11px] uppercase text-ink/50">Email</p>
                  <p className="text-[14px]">{nomination.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/50">Phone</p>
                  <p className="text-[14px]">{nomination.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/50">Chapter</p>
                  <p className="text-[14px]">{nomination.chapter}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/50">Justification / Platform</p>
                  <p className="text-[14px] leading-relaxed mt-1">{nomination.justification}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-ink/50">Date Submitted</p>
                  <p className="mono text-[12px]">{new Date(nomination.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                {nomination.status === "pending" && (
                  <>
                    <button onClick={() => startTransition(async () => { await approveNomination(nomination.id); router.refresh(); })} disabled={pending} className="border border-term/40 bg-term/10 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-term hover:bg-term/20 transition-colors disabled:opacity-50">
                      Approve
                    </button>
                    <button onClick={() => startTransition(async () => { await rejectNomination(nomination.id); router.refresh(); })} disabled={pending} className="border border-brand/40 bg-brand/10 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-brand-text hover:bg-brand/20 transition-colors disabled:opacity-50">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="display text-2xl mb-4">Timeline & Notes</h3>
              <div className="border border-line bg-cream p-6">
                <form onSubmit={handleAddNote} className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add an internal note..."
                    rows={3}
                    className="w-full border border-line bg-paper p-3 text-[14px] focus:border-brand focus:outline-none mb-2"
                  />
                  <button type="submit" disabled={addingNote || !comment.trim()} className="press w-full border border-2 border-ink bg-brand px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50">
                    {addingNote ? "Adding..." : "Add Note"}
                  </button>
                </form>

                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-[13px] text-ink/50 text-center italic">No notes yet.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="border-l-2 border-ink/20 pl-4 py-1">
                        <p className="text-[13px]">{note.comment}</p>
                        <p className="mono text-[10px] text-ink/40 mt-1 uppercase tracking-[0.1em]">
                          {note.authorName} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}