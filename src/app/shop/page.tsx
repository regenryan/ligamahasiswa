"use client";

import { useState, Suspense } from "react";
import { Shell } from "@/components/shells";
import {
  PageHead,
  SectionHead,
  Btn,
  CartDrawerSlot,
  JoinBand,
  NewsletterBand,
} from "@/components/sections";
import { Reveal, CartProvider, FilterPills, useCart } from "@/components/interactive";
import { useAuth } from "@/components/auth-provider";
import { Marquee } from "@/components/Marquee";
import { ShopCard } from "@/components/sections";
import { products } from "@/lib/mock";

const DIR = 27;

type ShopFilter = "All" | "Member exclusive";
const FILTERS: ShopFilter[] = ["All", "Member exclusive"];

function ShopMarquee() {
  return (
    <Marquee
      items={[
        "Mansuh AUKU",
        "Free the campus",
        "All proceeds fund the movement",
        "Members get the best prices",
        "Free shipping over RM50",
        "Every ringgit stays in the fight",
      ]}
      className="border-y border-line bg-brand py-2 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white"
    />
  );
}

function ShopGrid() {
  const [filter, setFilter] = useState<ShopFilter>("All");
  const { add } = useCart();
  const { user } = useAuth();
  const isMember = user?.status === "approved";
  const items = filter === "All" ? products : products.filter((p) => p.memberOnly);
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHead
            index={1}
            title="The catalog"
            sub="Four public items, two member exclusives, one mission."
          />
        </Reveal>
        <Reveal className="mb-8">
          <FilterPills options={FILTERS} value={filter} onChange={setFilter} label="Filter" />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ShopCard p={p} onAdd={() => add(p)} isMember={isMember} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberBand() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-line bg-cream p-8">
          <div className="max-w-xl">
            <p className="display text-2xl sm:text-3xl">Members pay less</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
              The member card is free and issued instantly. It unlocks member prices on the
              hoodie and lanyard, first dibs on every drop, and free shipping over RM50.
            </p>
          </div>
          <Btn kind="join" href="/dashboard/card">
            Get your member card
          </Btn>
        </div>
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <Shell dir={DIR}>
        <CartProvider>
          <PageHead
            kicker="Shop"
            title="Wear the movement"
            sub="Every ringgit funds campaigns, prints, and the next assembly. Members get the best prices."
          />
          <ShopMarquee />
          <ShopGrid />
          <MemberBand />
          <JoinBand />
          <NewsletterBand />
          <CartDrawerSlot />
        </CartProvider>
      </Shell>
    </Suspense>
  );
}
