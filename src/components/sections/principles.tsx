const PRINCIPLES = [
  {
    num: "01",
    title: "Keadilan Sosial",
    description: "Equitable access to education, resources, and opportunity for every student — regardless of background, identity, or campus.",
  },
  {
    num: "02",
    title: "Intelektualisme",
    description: "Rigorous scholarship, critical inquiry, and academic freedom. The classroom is a site of struggle, not compliance.",
  },
  {
    num: "03",
    title: "Autonomi",
    description: "Student self-governance free from institutional overreach. Our campuses belong to us.",
  },
];

export function Principles() {
  return (
    <section className="border-b border-line bg-midnight" id="principles">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-fog/50">Our principles</p>
        <h2 className="display mt-4 text-3xl sm:text-4xl leading-[0.95] text-fog">
          What we stand for
        </h2>
        <div className="mt-12 space-y-0">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="flex gap-6 border-t border-fog/15 py-8 first:border-t-0">
              <span className="display shrink-0 text-4xl text-fog/20">{p.num}</span>
              <div>
                <h3 className="display text-xl text-fog">{p.title}</h3>
                <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-fog/70">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
