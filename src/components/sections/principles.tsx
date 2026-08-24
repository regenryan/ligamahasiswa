const PRINCIPLES = [
  {
    title: "Keadilan Sosial",
    subtitle: "Social Justice",
    description: "Equitable access to education, resources, and opportunity for every student — regardless of background, identity, or campus.",
  },
  {
    title: "Intelektualisme",
    subtitle: "Intellectualism",
    description: "Rigorous scholarship, critical inquiry, and academic freedom. The classroom is a site of struggle, not compliance.",
  },
  {
    title: "Autonomi",
    subtitle: "Autonomy",
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
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="border border-fog/20 bg-fog/5 p-7">
              <h3 className="display text-xl text-fog">{p.title}</h3>
              <p className="mono mt-1 text-[11px] uppercase tracking-[0.14em] text-fog/50">{p.subtitle}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-fog/70">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
