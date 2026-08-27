"use client";

import { SectionHead, Btn } from "@/components/sections/head";
import { CampaignCard, ShopCard } from "@/components/sections/cards";
import { CartDrawerSlot } from "@/components/sections/cart";
import { Marquee } from "@/components/Marquee";
import { Reveal, JoinForm, useCart } from "@/components/interactive";
import { useAuth } from "@/components/auth-provider";

type Product = { slug: string; chapterSlug: string; name: string; price: string; tag: string; memberOnly: boolean; preorder: boolean; deliveryEstimate: string };
type Campaign = { slug: string; chapterSlug: string; title: string; status: string; summary: string; demands: string[] };

const mediaItems: { slug: string; outlet: string }[] = [];
const allProducts: Product[] = [];
const allCampaigns: Campaign[] = [];

const stories = [
  { name: "Afiqah", text: "I joined because I was tired of reading about problems and doing nothing. Now I organize assemblies." },
  { name: "Harris", text: "The movement gave me something uni never did — a sense that my voice actually matters." },
  { name: "Suriya", text: "We are not waiting for permission. We are building the structure we wish existed." },
];

const allies = [
  "UM", "UTM", "USM", "UniSZA", "SPARC UTeM", "UKM", "UPM", "UKM",
];

export function Evidence() {
  return (
    <section className="border-b border-line bg-midnight">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-fog/50 shrink-0">In the news</p>
          <div className="h-4 w-px bg-fog/15 shrink-0" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            {mediaItems.map((m) => (
              <span key={m.slug} className="border border-fog/15 bg-fog/5 px-3 py-1.5 mono text-[11px] uppercase tracking-[0.12em] text-fog/60">
                {m.outlet}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MemberTeaser() {
  const perks = [
    "Instant digital member card",
    "Member prices across the shop",
    "Priority entry at every assembly",
    "Vote in league decisions",
  ];
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <SectionHead index={1} title="Your member card is the ticket" sub="Registration takes 2 minutes. Your digital member card unlocks member prices, priority at assemblies, and a vote." />
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-ink/80">
                <span className="accent text-[11px]">{"\u25C6"}</span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn kind="join" href="/dashboard/card" size="lg">Get your card</Btn>
            <Btn kind="ghost" href="/chapters">Find your chapter</Btn>
          </div>
        </Reveal>
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-2 blur-xl bg-brand/25" aria-hidden="true" />
            <div className="relative border border-line bg-cream p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="display text-2xl">Liga Mahasiswa</p>
                  <p className="mono mt-1 text-[11px] uppercase tracking-[0.2em] text-fog/50">Digital member card</p>
                </div>
                <span className="accent text-xl" aria-hidden="true">{"\u2716"}</span>
              </div>
              <div className="my-6 h-px bg-line" />
              <div className="flex items-center gap-4">
                <div className="halftone flex h-16 w-16 items-center justify-center border border-line bg-midnight">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-fog/60">AH</span>
                </div>
                <div>
                  <p className="text-[15px] font-bold">Alyaah Hani</p>
                  <p className="text-[13px] text-fog/60">President / Malaysia</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {["Member", "Since 2024", "Active"].map((m) => (
                  <div key={m} className="flex items-center justify-center border border-fog/15 bg-midnight px-2 py-2 text-[11px] uppercase tracking-[0.1em] text-fog/60">
                    {m}
                  </div>
                ))}
              </div>
              <div className="mono mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-fog/40">
                <span>LMM-2026-0001</span>
                <span className="accent">Verified</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CampaignSection({
  items = allCampaigns,
  headline = "Campaigns",
  sub = "Every campaign needs money and hands. Pick one and get in.",
}: {
  items?: Campaign[];
  headline?: string;
  sub?: string;
}) {
  const id = "campaigns";
  return (
    <section id={id} className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal><SectionHead index={2} title={headline} sub={sub} /></Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <CampaignCard c={c} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
            <p className="mono text-[12px] uppercase tracking-[0.14em] text-ink/50">All campaigns across chapters</p>
            <Btn kind="ghost" href="/campaigns">More campaigns</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ShopStrip({ items = allProducts }: { items?: Product[] }) {
  const { add } = useCart();
  const { user } = useAuth();
  const isMember = ["member", "committee", "national", "admin"].includes(user?.role ?? "");
  const onAdd = (p: Product) => add(p);
  return (
    <section className="border-b border-line bg-midnight">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal><SectionHead index={3} title="Wear the movement" sub="Every ringgit funds campaigns, prints, and the next assembly. Members get the best prices." /></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ShopCard p={p} onAdd={() => onAdd(p)} isMember={isMember} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fog/15 pt-6">
            <p className="mono text-[12px] uppercase tracking-[0.14em] text-fog/50">Full catalog in the shop</p>
            <Btn kind="ghost" href="/shop">Open the shop</Btn>
          </div>
        </Reveal>
      </div>
      <CartDrawerSlot />
    </section>
  );
}

export function StoryStrip() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead index={4} title="Why we show up" sub="Three voices from the movement. Yours could be next." />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <figure className="flex h-full flex-col border border-line bg-cream p-6">
                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/80">
                  {"\u201C"}{s.text}{"\u201D"}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="halftone flex h-9 w-9 items-center justify-center border border-line bg-midnight">
                    <span className="text-[10px] font-extrabold uppercase text-fog/60">{s.name.slice(0, 1)}</span>
                  </span>
                  <span className="text-[13px] font-bold">{s.name}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div className="overflow-hidden border border-line bg-midnight py-3">
            <Marquee items={allies} className="" sep="+" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function JoinBand() {
  return (
    <section id="join" className="border-b border-line bg-brand">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-paper/85">The movement is 2 minutes away</p>
          <h2 className="display mt-4 text-4xl leading-[0.9] text-paper sm:text-6xl">Join the movement</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper">
            Membership is RM10. Your digital card is issued instantly, and your chapter committee verifies you within days. What are you waiting for?
          </p>
          <div className="mono mt-8 text-[11px] uppercase tracking-[0.16em] text-paper/85">55 years is enough. Day 1 starts today.</div>
        </Reveal>
        <Reveal delay={80}>
          <JoinForm />
        </Reveal>
      </div>
    </section>
  );
}


