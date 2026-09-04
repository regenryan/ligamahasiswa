"use client";

import { useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import Link from "next/link";
import { submitMediaLink, deleteMedia } from "@/app/actions/media";

type MediaRow = {
  id: string;
  name: string;
  link: string;
  type: string;
  date: string;
  chapter: string;
};

type ChapterOption = {
  id: string;
  name: string;
};

export function AdminMediaClient({ mediaItems, chapters }: { mediaItems: MediaRow[], chapters: ChapterOption[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(submitMediaLink, undefined);

  return (
    <Shell dir={27}>
      <PageHead kicker="Admin" title="Media Hub" sub="Manage external media links and coverage." />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Link href="/admin" className="mono mb-6 inline-block text-[11px] uppercase tracking-[0.14em] text-ink/50 hover:text-brand transition-colors">
            {"\u2190"} Back to admin
          </Link>
          
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div className="border border-line bg-cream p-6">
              <h3 className="display text-xl mb-4">Add Media Link</h3>
              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="url" className="mb-1.5 block text-[13px] font-bold">URL</label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    required
                    placeholder="https://..."
                    className="w-full border border-line bg-paper px-3 py-2 text-[14px] focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="mb-1.5 block text-[13px] font-bold">Type</label>
                  <select
                    id="type"
                    name="type"
                    className="w-full border border-line bg-paper px-3 py-2 text-[14px] focus:border-brand focus:outline-none"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="podcast">Podcast</option>
                    <option value="social">Social</option>
                    <option value="zine">Zine</option>
                    <option value="statement">Statement</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="chapterId" className="mb-1.5 block text-[13px] font-bold">Chapter</label>
                  <select
                    id="chapterId"
                    name="chapterId"
                    required
                    className="w-full border border-line bg-paper px-3 py-2 text-[14px] focus:border-brand focus:outline-none"
                  >
                    <option value="">Select chapter</option>
                    {chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>
                
                {state?.error && (
                  <p className="text-[13px] text-brand-text">{state.error}</p>
                )}
                {state?.ok && (
                  <p className="text-[13px] text-term">Media added successfully!</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="press w-full border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add Media"}
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-line bg-cream">
                    <th className="px-4 py-3 font-bold">Title</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Chapter</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {mediaItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                        No media links found.
                      </td>
                    </tr>
                  ) : (
                    mediaItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">
                            {item.name || "Untitled"}
                          </a>
                        </td>
                        <td className="px-4 py-3 mono text-[12px] uppercase">{item.type}</td>
                        <td className="px-4 py-3 text-ink/60">{item.chapter}</td>
                        <td className="px-4 py-3 mono text-[12px] text-ink/60">{item.date}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => startTransition(async () => { await deleteMedia(item.id); router.refresh(); })}
                            disabled={pending}
                            className="text-[12px] font-bold text-brand-text hover:underline disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}