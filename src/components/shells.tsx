"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ActiveLink } from "@/components/ActiveLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MetroClock } from "@/components/MetroClock";
import { NavAuth } from "@/components/nav-auth";

const NAV_LINKS = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/chapters", label: "Chapters" },
  { href: "/events", label: "Events" },
  { href: "/fundraise", label: "Fundraise" },
  { href: "/election", label: "Election" },
  { href: "/shop", label: "Shop" },
  { href: "/media", label: "Media" },
];

type DirProps = { dir: number };

function TopStrip() {
  return (
    <div className="mono grid grid-cols-3 items-center border-b border-line bg-midnight px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-fog/80">
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

function Hamburger({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center md:hidden"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <span className="relative h-4 w-5" aria-hidden="true">
        <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-200 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
        <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink transition-all duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`absolute left-0 h-px w-full bg-ink transition-all duration-200 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
      </span>
    </button>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <TopStrip />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 border-x border-line px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_auto] md:gap-6 md:py-4">
        <Hamburger open={open} onToggle={() => setOpen(!open)} />
        <Link href="/" className="focus-visible:outline-none" aria-label="Liga Mahasiswa home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
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

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-88px)] overflow-y-auto border-t border-line bg-paper/98 backdrop-blur md:hidden"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href}>
                  <ActiveLink
                    href={l.href}
                    className="flex items-center gap-3 border-b border-line py-3 text-[15px] font-bold uppercase tracking-[0.08em] text-ink/70 hover:text-brand"
                    activeClassName="metro-active"
                    onClick={() => setOpen(false)}
                  >
                    <span className="mono text-[12px] text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                    <span>{l.label}</span>
                  </ActiveLink>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <NavAuth />
            </div>
          </div>
        </nav>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
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
      {[
        { name: "Instagram", href: "https://instagram.com/ligamahasiswa" },
        { name: "TikTok", href: "https://tiktok.com/@ligamahasiswa" },
        { name: "YouTube", href: "https://youtube.com/@ligamahasiswa" },
      ].map((s) => (
        <li key={s.name}>
          <a className="text-fog/75 hover:text-brand transition-colors" href={s.href} target="_blank" rel="noreferrer">
            {s.name}
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
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:contact@ligamahasiswa.my" className="text-fog/75 hover:text-brand transition-colors">contact@ligamahasiswa.my</a></li>
              <li><a href="mailto:admin@ligamahasiswa.my" className="text-fog/75 hover:text-brand transition-colors">admin@ligamahasiswa.my</a></li>
            </ul>
            <p className="mono mt-4 mb-1 text-[11px] tracking-[0.18em] text-fog/50">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="text-fog/75 hover:text-brand transition-colors">Dashboard</Link></li>
            </ul>
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
