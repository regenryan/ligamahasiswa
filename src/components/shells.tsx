import Link from "next/link";

const LINKS = [
  { href: "/chapters/malaysia", label: "Chapters" },
  { href: "/chapters/malaysia/campaigns/mansuh-auku", label: "Campaigns" },
  { href: "/media", label: "Media" },
  { href: "/shop", label: "Shop" },
  { href: "/zine", label: "Zine" },
];

function RedX({ className = "" }: { className?: string }) {
  return (
    <span className={`red-x ${className}`} aria-hidden="true">
      <span className="sr-only">X</span>
    </span>
  );
}

/* ---------- A. Kad Merah ---------- */

export function NavA() {
  return (
    <header className="dir-a border-b-4 border-ink bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="display text-2xl leading-none">
          LIGA<RedX className="text-brand" />
          <span className="sr-only">Liga Mahasiswa</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="display text-sm tracking-wider text-ink/80 transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/card"
            className="display hidden text-sm tracking-wider text-ink/60 hover:text-ink sm:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="press display bg-brand px-4 py-2 text-sm tracking-wider text-paper hover:bg-brand-dark"
          >
            JOIN
          </Link>
        </div>
      </div>
    </header>
  );
}

export function FooterA() {
  return (
    <footer className="dir-a relative bg-ink text-paper">
      <div className="halftone-light absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-16">
        <p className="display text-4xl leading-tight sm:text-6xl">
          MANSUH AUKU.
          <br />
          KAMPUS KITA.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="display mb-3 text-sm tracking-widest text-brand">Newsletter</p>
            <form className="flex">
              <input
                type="email"
                placeholder="email kau"
                className="w-full border-2 border-paper/30 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-brand focus:outline-none"
              />
              <button type="submit" className="press bg-brand px-4 text-sm font-bold text-paper">
                Hantar
              </button>
            </form>
          </div>
          <div>
            <p className="display mb-3 text-sm tracking-widest text-brand">Pautan</p>
            <ul className="space-y-2 text-sm text-paper/80">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-hi">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/prk" className="hover:text-hi">
                  PRK
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="display mb-3 text-sm tracking-widest text-brand">Ikut kami</p>
            <ul className="space-y-2 text-sm text-paper/80">
              <li>
                <Link href="https://instagram.com/ligamahasiswa.my" className="hover:text-hi">
                  @ligamahasiswa.my
                </Link>
              </li>
              <li>
                <Link href="mailto:ligamahasiswa.my@gmail.com" className="hover:text-hi">
                  ligamahasiswa.my@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-paper/50">
          Liga Mahasiswa Malaysia. Dibina oleh mahasiswa, untuk mahasiswa.
        </p>
      </div>
    </footer>
  );
}

/* ---------- B. Skuad Kampus ---------- */

export function NavB() {
  return (
    <header className="dir-b sticky top-3 z-40 px-4 pt-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl bg-cream/90 px-5 py-3 shadow-[0_2px_16px_rgba(17,17,17,0.08)] backdrop-blur">
        <Link href="/" className="font-baloo text-xl font-bold leading-none text-ink">
          liga
          <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-brand" />
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-hi/60 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/card"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink/50 hover:text-ink"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="press rounded-full bg-brand px-4 py-2 text-sm font-bold text-paper"
          >
            Join kami
          </Link>
        </div>
      </div>
    </header>
  );
}

export function FooterB() {
  return (
    <footer className="dir-b bg-cream px-4 pb-6 pt-12">
      <div className="mx-auto max-w-6xl rounded-3xl bg-paper p-8 shadow-[0_2px_20px_rgba(17,17,17,0.06)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-baloo text-2xl font-bold leading-snug">
              Kampus tu milik kita.
              <br />
              <span className="text-brand">Jom jadi sebahagian.</span>
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Newsletter mingguan. Cerita gerakan, event, peluang volunteer.
            </p>
            <form className="mt-4 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="email kau"
                className="w-full rounded-full border-2 border-ink/15 bg-paper px-4 py-2 text-sm focus:border-brand focus:outline-none"
              />
              <button type="submit" className="press rounded-full bg-ink px-5 py-2 text-sm font-bold text-paper">
                Hantar
              </button>
            </form>
          </div>
          <div className="flex gap-10 text-sm">
            <ul className="space-y-2 text-ink/70">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-ink/70">
              <li>
                <Link href="/prk" className="hover:text-brand">
                  PRK
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com/ligamahasiswa.my" className="hover:text-brand">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="mailto:ligamahasiswa.my@gmail.com" className="hover:text-brand">
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-ink/40">
          Liga Mahasiswa Malaysia. Dibina oleh mahasiswa, untuk mahasiswa.
        </p>
      </div>
    </footer>
  );
}

/* ---------- C. Midnight Demo ---------- */

export function NavC() {
  return (
    <header className="dir-c sticky top-0 z-40 border-b border-white/10 bg-midnight/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link
          href="/"
          className="display text-xl leading-none text-paper [text-shadow:0_0_18px_rgba(255,59,48,0.5)]"
        >
          LIGA<span className="text-glow">.</span>
          <span className="sr-only">Liga Mahasiswa</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-semibold uppercase tracking-[0.14em] text-paper/60 transition-colors hover:text-glow"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/card"
            className="hidden text-[13px] font-semibold uppercase tracking-[0.14em] text-paper/50 hover:text-paper sm:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="press bg-brand px-4 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-paper shadow-[0_0_24px_rgba(225,29,46,0.45)]"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}

export function FooterC() {
  return (
    <footer className="dir-c bg-midnight text-paper">
      <div className="border-y border-white/10 bg-brand py-3">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span
              key={i}
              className="display whitespace-nowrap px-4 text-sm tracking-[0.2em] text-paper"
            >
              MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU MANSUH AUKU
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-3xl leading-tight">
            DAH SUBUH.
            <br />
            MASIH BELUM MENANG.
          </p>
          <form className="mt-6 flex max-w-sm">
            <input
              type="email"
              placeholder="email kau"
              className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-glow focus:outline-none"
            />
            <button type="submit" className="press bg-glow px-4 text-sm font-bold text-midnight">
              Daftar
            </button>
          </form>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/40">Sitemap</p>
          <ul className="space-y-2.5 text-sm text-paper/70">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-glow">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/prk" className="hover:text-glow">
                PRK
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/40">Sosial</p>
          <ul className="space-y-2.5 text-sm text-paper/70">
            <li>
              <Link href="https://instagram.com/ligamahasiswa.my" className="hover:text-glow">
                @ligamahasiswa.my
              </Link>
            </li>
            <li>
              <Link href="mailto:ligamahasiswa.my@gmail.com" className="hover:text-glow">
                Email
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-6 text-center text-xs text-paper/40">
        Liga Mahasiswa Malaysia. Dibina oleh mahasiswa, untuk mahasiswa.
      </p>
    </footer>
  );
}

/* ---------- D. Zine Print ---------- */

export function NavD() {
  return (
    <header className="dir-d border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div>
          <Link href="/" className="display text-lg leading-none">
            LIGA MAHASISWA
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink/50">
            Edisi satu: Kampus Bebas
          </p>
        </div>
        <nav className="hidden items-center gap-5 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-bold uppercase tracking-[0.12em] text-ink/70 underline-offset-4 hover:text-brand hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/register"
          className="press stamp bg-brand px-4 py-1.5 text-xs font-bold text-paper"
        >
          Join kami
        </Link>
      </div>
    </header>
  );
}

export function FooterD() {
  return (
    <footer className="dir-d border-t-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="display text-3xl leading-tight">
            MANSUH AUKU.
            <br />
            KAMPUS KITA.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
            Zine ini diterbitkan secara berkala oleh Liga Mahasiswa Malaysia. Cetak sendiri,
            kongsi dengan kawan, tampal di pintu bilik.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="stamp text-xs text-brand">Edisi percuma</span>
            <span className="text-xs text-ink/50">Nombor 01 / 2026</span>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
            Ikut kami
          </p>
          <ul className="space-y-2 text-sm text-ink/70">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:text-brand hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/prk" className="underline-offset-4 hover:text-brand hover:underline">
                PRK
              </Link>
            </li>
            <li>
              <Link
                href="https://instagram.com/ligamahasiswa.my"
                className="underline-offset-4 hover:text-brand hover:underline"
              >
                @ligamahasiswa.my
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-ink/20 px-5 py-5 text-center text-xs text-ink/50">
        Liga Mahasiswa Malaysia. Dibina oleh mahasiswa, untuk mahasiswa.
      </p>
    </footer>
  );
}

/* ---------- E. Flat Signal ---------- */

export function NavE() {
  return (
    <header className="dir-e bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="display bg-brand px-2 py-1 text-base leading-none text-paper">LIGA</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-paper/70 transition-colors hover:text-hi"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/register"
          className="press bg-hi px-4 py-2 text-sm font-black text-ink"
        >
          JOIN
        </Link>
      </div>
    </header>
  );
}

export function FooterE() {
  return (
    <footer className="dir-e bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="display text-3xl leading-tight sm:text-4xl">
              TAMATKAN AUKU.
              <span className="block text-brand">START KAMPUS BARU.</span>
            </p>
            <form className="mt-6 flex max-w-sm">
              <input
                type="email"
                placeholder="email kau"
                className="w-full border border-paper/25 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper/40 focus:border-hi focus:outline-none"
              />
              <button type="submit" className="press bg-brand px-4 text-sm font-bold text-paper">
                Hantar
              </button>
            </form>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/40">Map</p>
            <ul className="space-y-2.5 text-sm text-paper/70">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-hi">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/prk" className="hover:text-hi">
                  PRK
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/40">Sosial</p>
            <ul className="space-y-2.5 text-sm text-paper/70">
              <li>
                <Link href="https://instagram.com/ligamahasiswa.my" className="hover:text-hi">
                  @ligamahasiswa.my
                </Link>
              </li>
              <li>
                <Link href="mailto:ligamahasiswa.my@gmail.com" className="hover:text-hi">
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-paper/15 pt-6 text-xs text-paper/40">
          Liga Mahasiswa Malaysia. Dibina oleh mahasiswa, untuk mahasiswa.
        </p>
      </div>
    </footer>
  );
}
