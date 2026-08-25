const BAR = "animate-pulse bg-cream border border-line";

/* ---------- Generic primitives ---------- */

export function SkeletonLine({ w = "w-3/4" }: { w?: string }) {
  return <div className={`h-4 ${w} ${BAR}`} />;
}

export function SkeletonSectionHead() {
  return (
    <div className="mb-8">
      <div className={`h-3 w-20 ${BAR}`} />
      <div className={`mt-3 h-6 w-48 ${BAR}`} />
      <div className={`mt-2 h-4 w-72 ${BAR}`} />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`px-4 py-5 sm:px-6 ${BAR}`}>
            <div className={`h-8 w-12 ${BAR}`} style={{ border: "none" }} />
            <div className={`mt-2 h-3 w-16 ${BAR}`} style={{ border: "none" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonPageHead() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className={`h-3 w-24 ${BAR}`} />
        <div className={`mt-4 h-10 w-64 ${BAR}`} />
        <div className={`mt-4 h-4 w-96 max-w-full ${BAR}`} />
      </div>
    </section>
  );
}

/* ---------- CampaignCard skeleton (matches cards.tsx CampaignCard) ---------- */

export function SkeletonCampaignCard() {
  return (
    <div className={`flex flex-col p-6 ${BAR}`}>
      <div className="flex items-center justify-between gap-3">
        <div className={`h-5 w-16 ${BAR}`} style={{ border: "none" }} />
        <div className={`h-3 w-16 ${BAR}`} style={{ border: "none" }} />
      </div>
      <div className={`mt-4 h-6 w-3/4 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-3 h-4 w-full ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-4 h-4 w-5/6 ${BAR}`} style={{ border: "none" }} />
      <div className="mt-4 space-y-2 border-t border-line pt-4">
        <div className={`h-3 w-full ${BAR}`} style={{ border: "none" }} />
        <div className={`h-3 w-4/5 ${BAR}`} style={{ border: "none" }} />
      </div>
      <div className="mt-6">
        <div className={`h-10 w-full ${BAR}`} />
      </div>
    </div>
  );
}

/* ---------- EventCard skeleton (matches events/page.tsx EventCard) ---------- */

export function SkeletonEventCard() {
  return (
    <div className={`flex flex-col gap-2 p-5 ${BAR}`}>
      <div className="flex items-center gap-2">
        <div className={`h-4 w-20 ${BAR}`} style={{ border: "none" }} />
        <div className={`h-4 w-16 ${BAR}`} style={{ border: "none" }} />
      </div>
      <div className={`mt-1 h-5 w-3/4 ${BAR}`} style={{ border: "none" }} />
      <div className={`h-3 w-1/3 ${BAR}`} style={{ border: "none" }} />
    </div>
  );
}

/* ---------- EventCardCompact skeleton (matches events-section.tsx 2-col card) ---------- */

export function SkeletonEventCardCompact() {
  return (
    <div className={`flex flex-col gap-2 p-5 ${BAR}`}>
      <div className="flex items-center gap-2">
        <div className={`h-3 w-16 ${BAR}`} style={{ border: "none" }} />
        <div className={`h-3 w-20 ${BAR}`} style={{ border: "none" }} />
      </div>
      <div className={`mt-1 h-5 w-3/4 ${BAR}`} style={{ border: "none" }} />
      <div className={`h-3 w-1/4 ${BAR}`} style={{ border: "none" }} />
    </div>
  );
}

/* ---------- ShopCard skeleton (matches cards.tsx ShopCard) ---------- */

export function SkeletonShopCard() {
  return (
    <div className={`flex flex-col p-5 ${BAR}`}>
      <div className={`h-3 w-16 ${BAR}`} style={{ border: "none" }} />
      <div className="my-4 aspect-square w-full bg-mist" />
      <div className={`h-5 w-2/3 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-2 h-6 w-16 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-1 h-3 w-20 ${BAR}`} style={{ border: "none" }} />
      <div className="mt-4">
        <div className={`h-10 w-full ${BAR}`} />
      </div>
    </div>
  );
}

/* ---------- MediaCard skeletons ---------- */

export function SkeletonMediaPostCard() {
  return (
    <div className={`flex flex-col gap-2 p-5 ${BAR}`}>
      <div className={`h-5 w-20 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-2 h-3 w-full ${BAR}`} style={{ border: "none" }} />
      <div className={`h-3 w-5/6 ${BAR}`} style={{ border: "none" }} />
    </div>
  );
}

export function SkeletonMediaLinkCard() {
  return (
    <div className={`flex flex-col gap-2 p-5 ${BAR}`}>
      <div className={`h-5 w-3/4 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-2 h-3 w-full ${BAR}`} style={{ border: "none" }} />
      <div className={`h-3 w-2/3 ${BAR}`} style={{ border: "none" }} />
    </div>
  );
}

/* ---------- Detail page skeleton (matches detail page 3-col layout) ---------- */

export function SkeletonDetail() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className={`mb-8 h-3 w-32 ${BAR}`} />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className={`h-4 w-full ${BAR}`} />
          <div className={`h-4 w-5/6 ${BAR}`} />
          <div className={`h-4 w-4/6 ${BAR}`} />
        </div>
        <div className={`p-5 ${BAR}`}>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className={`h-3 w-12 ${BAR}`} style={{ border: "none" }} />
                <div className={`mt-1 h-4 w-24 ${BAR}`} style={{ border: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Chapter cards skeleton (matches chapters/page.tsx Link cards) ---------- */

export function SkeletonChapterCard() {
  return (
    <div className={`flex flex-col p-6 ${BAR}`}>
      <div className={`h-7 w-16 ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-3 h-4 w-full ${BAR}`} style={{ border: "none" }} />
      <div className={`mt-5 h-3 w-24 ${BAR}`} style={{ border: "none" }} />
    </div>
  );
}

/* ---------- Compound grid skeletons ---------- */

export function SkeletonCampaignGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCampaignCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonEventGrid({ count = 3, cols = 3 }: { count?: number; cols?: number }) {
  const colClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-5 ${colClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonShopGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonShopCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonMediaGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMediaLinkCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChapterGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonChapterCard key={i} />
      ))}
    </div>
  );
}

/* ---------- Generic fallback ---------- */

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <SkeletonCampaignGrid count={count} />
    </div>
  );
}
