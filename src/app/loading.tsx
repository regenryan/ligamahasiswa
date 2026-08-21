export default function Loading() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin border-2 border-ink/20 border-t-brand" />
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
          Loading
        </p>
      </div>
    </section>
  );
}
