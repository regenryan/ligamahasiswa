export function Introduction() {
  return (
    <section className="border-b border-line" id="introduction">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">About</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl leading-[0.95]">
              What is Liga Mahasiswa
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-ink/70">
            <p>
              Liga Mahasiswa Malaysia is the national student movement uniting chapters across public universities. We organise, advocate, and fight for student rights — from campus autonomy to social justice.
            </p>
            <p>
              Every campus has its own chapter. Every chapter runs its own campaigns. Together, we are one movement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
