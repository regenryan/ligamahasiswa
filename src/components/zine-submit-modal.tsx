"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useActionState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CHAPTERS } from "@/lib/chapters";
import { submitZine } from "@/app/actions/zine";

type ZineModalCtx = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const ZineModalContext = createContext<ZineModalCtx | null>(null);

export function ZineModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  return (
    <ZineModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
      {open ? <ZineModal onClose={closeModal} /> : null}
    </ZineModalContext.Provider>
  );
}

export function useZineModal() {
  const ctx = useContext(ZineModalContext);
  if (!ctx) throw new Error("useZineModal must be used within ZineModalProvider");
  return ctx;
}

function ZineModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(submitZine, undefined);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50"
      />
      <div className="relative w-full max-w-lg border border-line bg-paper p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[18px] leading-none text-ink/50 hover:text-brand"
        >
          ✕
        </button>

        <h2 className="display text-3xl leading-[0.9]">Submit a zine</h2>
        <p className="mt-3 text-[14px] text-ink/60">
          Share your writing with the movement.
        </p>

        {state?.error ? (
          <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
            {state.error}
          </div>
        ) : null}

        <form action={action} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="zine-title" className="mb-1.5 block text-[13px] font-bold">
              Title
            </label>
            <input
              id="zine-title"
              name="title"
              type="text"
              minLength={3}
              placeholder="Your zine title"
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <div>
            <label htmlFor="zine-chapter" className="mb-1.5 block text-[13px] font-bold">
              Chapter
            </label>
            <select
              id="zine-chapter"
              name="chapter"
              defaultValue=""
              className="w-full border border-line bg-midnight px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="" disabled>
                Pick your chapter
              </option>
              {CHAPTERS.map((chapter) => (
                <option key={chapter.slug} value={chapter.slug}>
                  {chapter.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="zine-content" className="mb-1.5 block text-[13px] font-bold">
              Content
            </label>
            <textarea
              id="zine-content"
              name="content"
              rows={10}
              minLength={50}
              placeholder="Write your zine content here. At least 50 characters."
              className="w-full resize-y border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
          >
            {pending ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
