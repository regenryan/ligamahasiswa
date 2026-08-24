"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="mono text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/40">
        Error
      </p>
      <h1 className="display mt-4 text-4xl leading-none sm:text-6xl">
        Something broke
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
        An unexpected error occurred on this page.
      </p>
      {error.digest && (
        <p className="mono mt-2 text-[10px] text-ink/30">{error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="press mt-8 inline-flex border border-ink bg-ink px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-paper hover:bg-brand hover:text-paper"
      >
        Try again
      </button>
    </section>
  );
}
