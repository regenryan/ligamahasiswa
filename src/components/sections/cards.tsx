"use client";

import { StatusChip, Btn } from "@/components/sections/head";
import { LikeButton } from "@/components/interactive";
import type { Campaign, EventItem, MediaItem, Member, Product, ZinePost } from "@/lib/mock";

const FRAME = "border border-line bg-cream card-hover";

const QR_PATTERN: boolean[] = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
  if (corner) return !(r % 3 === 1 && c % 3 === 1);
  return ((r * 7 + c * 13) % 6) < 3;
});

function QrBox({ size = 4 }: { size?: number }) {
  return (
    <div aria-hidden="true" className="shrink-0 bg-ink p-1">
      <div className="grid grid-cols-9">
        {QR_PATTERN.map((on, i) => (
          <span
            key={i}
            className={on ? "bg-paper" : "bg-ink"}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- CampaignCard ---------- */

export function CampaignCard({ c }: { c: Campaign }) {
  const href = `/chapters/${c.chapterSlug}/campaigns/${c.slug}`;
  const chapLabel = c.chapterSlug === "malaysia" ? "National" : c.chapterSlug.toUpperCase();

  return (
    <article className={`group flex h-full flex-col p-6 ${FRAME}`}>
      <div className="flex items-center justify-between gap-3">
        <StatusChip status={c.status} />
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/40">{chapLabel}</span>
      </div>
      <h3 className="display mt-4 text-2xl leading-none">{c.title}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">{c.summary}</p>
      <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
        {c.demands.slice(0, 2).map((d) => (
          <li key={d} className="flex gap-2 text-[13px] text-ink/70">
            <span className="accent shrink-0">{"\u25C6"}</span>
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Btn kind="act" size="md" className="flex-1" href={href}>
          Read more
        </Btn>
      </div>
    </article>
  );
}

/* ---------- ShopCard ---------- */

export function ShopCard({ p, onAdd, isMember = false }: { p: Product; onAdd: () => void; isMember?: boolean }) {
  const canAdd = !p.memberOnly || isMember;
  return (
    <div className={`flex h-full flex-col p-5 ${FRAME}`}>
      <div className="flex items-center justify-between">
        <span className="mono text-[11px] uppercase tracking-[0.16em] text-ink/50">{p.tag}</span>
      </div>
      <div className="my-4 flex aspect-square items-center justify-center border border-line bg-midnight">
        <span className="mono text-[11px] uppercase tracking-[0.16em] text-ink/30">{p.tag}</span>
      </div>
      <p className="display text-xl leading-tight font-bold">{p.name}</p>
      <p className="mt-2 display text-2xl leading-none">{p.price}</p>
      <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/40">{p.memberOnly ? "Members only" : "Open to all"}</p>
      <div className="mt-4 flex-1" />
      {canAdd ? (
        <Btn kind="join" className="w-full" onClick={onAdd}>
          Add to cart
        </Btn>
      ) : (
        <Btn kind="ghost" className="w-full" href="/register">
          Join to unlock
        </Btn>
      )}
    </div>
  );
}

/* ---------- ZineCard ---------- */

export function ZineCard({ z }: { z: ZinePost }) {
  const chap = z.chapterSlug === "malaysia" ? "National" : z.chapterSlug.toUpperCase();
  return (
    <article className={`flex h-full flex-col p-6 ${FRAME}`}>
      <div className="flex items-center justify-between">
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/50">{chap}</span>
      </div>
      <h3 className="mt-4 text-2xl leading-none display">{z.title}</h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">{z.excerpt}</p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-[13px] font-bold text-ink/60">{z.author}</span>
        <LikeButton initial={z.likes} />
      </div>
    </article>
  );
}

/* ---------- MediaCard ---------- */

const KIND_SKIN: Record<MediaItem["kind"], string> = {
  Video: "border-brand/40 bg-brand/15 text-brand-text",
  Podcast: "border-pink/40 bg-pink/10 text-pink",
  Article: "border-hi/40 bg-hi/10 text-hi",
};
const KIND_VERB: Record<MediaItem["kind"], string> = {
  Video: "Watch",
  Podcast: "Listen",
  Article: "Read",
};

export function MediaCard({ m }: { m: MediaItem }) {
  const skin = KIND_SKIN[m.kind];
  return (
    <article className={`flex h-full flex-col p-6 ${FRAME}`}>
      <div className="flex items-center justify-between">
        <span className={`border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${skin}`}>{m.kind}</span>
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{m.outlet}</span>
      </div>
      <h3 className="mt-4 text-xl leading-snug display">{m.title}</h3>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/70">{m.blurb}</p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="mono text-[11px] text-ink/40">{m.date}</span>
        <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-brand-text">{KIND_VERB[m.kind]}</span>
      </div>
    </article>
  );
}

/* ---------- MemberCard ---------- */

export function MemberCard({ m, label }: { m: Member; label: string }) {
  const initials = m.name.split(" ").slice(0, 2).map((p) => p[0]).join("");
  return (
    <article className="flex flex-col overflow-hidden border border-line bg-midnight text-fog">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="display text-xl text-fog">Liga Mahasiswa</p>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-fog/50">{label}</p>
        </div>
        <QrBox size={3} />
      </div>
      <div className="h-px bg-fog/15" />
      <div className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-fog/20 bg-fog/10">
          <span className="text-[13px] font-extrabold uppercase text-fog/70">{initials}</span>
        </div>
        <div>
          <p className="text-[15px] font-bold leading-tight text-fog">{m.name}</p>
          <p className="mt-0.5 text-[12px] text-fog/60">{m.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fog/15 px-5 py-3">
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-fog/40">LMM-2026-0001</span>
        <span className="accent text-[10px] font-bold uppercase tracking-[0.12em]">Verified</span>
      </div>
    </article>
  );
}

/* ---------- EventCard ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function EventCard({ e }: { e: EventItem }) {
  const [, mon, day] = e.date.split("-").map(Number);
  const monthLabel = MONTHS[(mon ?? 1) - 1];
  return (
    <article className={`flex h-full flex-col p-6 ${FRAME}`}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="display text-3xl leading-none">{String(day ?? 1).padStart(2, "0")}</span>
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink/50">{monthLabel}</span>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink/50">{e.type}</span>
            <span className="mono text-[10px] text-ink/40">{e.time}</span>
          </div>
          <h3 className="mt-1 text-xl leading-none display">{e.title}</h3>
        </div>
      </div>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/70">{e.blurb}</p>
      <p className="mono mt-3 border-t border-line pt-3 text-[11px] uppercase tracking-[0.14em] text-ink/50">{e.place}</p>
    </article>
  );
}
