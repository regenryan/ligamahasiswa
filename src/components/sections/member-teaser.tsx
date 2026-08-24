import Link from "next/link";

export function MemberTeaser() {
  return (
    <section className="border-b border-line bg-midnight" id="member">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-fog/50">Join us</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl leading-[0.95] text-fog">
              Become a member
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-fog/70">
              Verified members get a digital ID card, member pricing on shop items, and access to the constitution. Membership is free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="press inline-flex border border-2 border-fog bg-fog/10 px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog hover:bg-fog/20 transition-colors">
                Sertai Liga
              </Link>
              <Link href="/dashboard" className="press inline-flex border border-fog/30 px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog/60 hover:border-fog hover:text-fog transition-colors">
                Member dashboard
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-fog/20 bg-fog/5 p-5 text-center">
              <p className="display text-3xl text-fog">6</p>
              <p className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-fog/50">Chapters</p>
            </div>
            <div className="border border-fog/20 bg-fog/5 p-5 text-center">
              <p className="display text-3xl text-fog">Free</p>
              <p className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-fog/50">Membership</p>
            </div>
            <div className="border border-fog/20 bg-fog/5 p-5 text-center">
              <p className="display text-3xl text-fog">1</p>
              <p className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-fog/50">Movement</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
