import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="mono text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/40">
        Error
      </p>
      <h1 className="display mt-4 text-6xl leading-none text-ink sm:text-8xl">
        404
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
        This route does not exist. The page you are looking for has been moved
        or was never here.
      </p>
      <Link
        href="/"
        className="press mt-8 inline-flex border border-ink bg-ink px-6 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-paper hover:bg-brand hover:text-paper"
      >
        Back to home
      </Link>
    </section>
  );
}
