import Link from "next/link";
import type { ReactNode } from "react";
import { ActiveLink } from "@/components/ActiveLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MetroClock } from "@/components/MetroClock";
import { NavAuth } from "@/components/nav-auth";

const NAV_LINKS = [
  { href: "/#campaigns", label: "Campaigns" },
  { href: "/chapters/malaysia", label: "Chapters" },
  { href: "/shop", label: "Shop" },
  { href: "/zine", label: "Zine" },
  { href: "/media", label: "Coverage" },
  { href: "/contact", label: "Contact" },
];

type DirProps = { dir: number };

function TopStrip() {
  return (
    <div className="mono grid grid-cols-3 items-center border-b border-line bg-midnight px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] text-fog/80">
      <div className="flex items-center justify-start">
        <MetroClock />
      </div>
      <span className="text-center">One system, one struggle</span>
      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span className="text-2xl font-black tracking-tight">
      LIGA
    </span>
  );
}

function NavCta() {
  return <NavAuth />;
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <TopStrip />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_auto] items-center gap-6 border-x border-line px-4 py-4 sm:px-6">
        <Link href="/" className="focus-visible:outline-none" aria-label="Liga Mahasiswa home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV_LINKS.map((l, i) => (
            <ActiveLink
              key={l.href}
              href={l.href}
              className="metro-nav-link px-3 py-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-ink/70 hover:text-brand"
              activeClassName="metro-active"
            >
              <span className="mono mr-1 text-ink/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="metro-nav-label">{l.label}</span>
            </ActiveLink>
          ))}
        </nav>
        <NavCta />
      </div>
    </header>
  );
}

function Footer() {
  const explore = (
    <ul className="space-y-2.5 text-sm">
      {NAV_LINKS.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="text-fog/75 hover:text-brand transition-colors">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
  const social = (
    <ul className="space-y-2.5 text-sm">
      {["Instagram", "TikTok", "YouTube"].map((s) => (
        <li key={s}>
          <a className="text-fog/75 hover:text-brand transition-colors" href={`https://${s.toLowerCase()}.com`} target="_blank" rel="noreferrer">
            {s}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="border-t border-line bg-midnight">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="mono mb-3 text-[11px] tracking-[0.18em] text-fog/50">Explore</p>
            {explore}
          </div>
          <div>
            <p className="mono mb-3 text-[11px] tracking-[0.18em] text-fog/50">Follow us</p>
            {social}
          </div>
          <div>
            <p className="mono mb-3 text-[11px] tracking-[0.18em] text-fog/50">Contact</p>
            <p className="mt-3 text-sm text-fog/75">contact@ligamahasiswa.my</p>
            <p className="text-sm text-fog/75">admin@ligamahasiswa.my</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-fog/20 pt-4">
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-fog/50">
            &copy; 2026 Liga Mahasiswa Malaysia
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-fog/50">
            <span className="accent">Mansuh AUKU</span> &middot; 55 years is enough
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ dir, children }: DirProps & { children: ReactNode }) {
  return (
    <div className={`dir-${dir} flex min-h-screen flex-col`}>
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
