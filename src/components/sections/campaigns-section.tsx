import Link from "next/link";
import { readSheet } from "@/lib/sheets-db";
import { chapterLabel } from "@/lib/chapters";
import { campaigns as mockCampaigns, type Campaign } from "@/lib/mock";

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const rows = await readSheet("Campaigns");
    if (rows.length === 0) return mockCampaigns;
    return rows.map((r) => ({
      slug: r.slug ?? "",
      chapterSlug: r.chapter_slug ?? "",
      title: r.title ?? "",
      status: (r.status as Campaign["status"]) ?? "Active",
      summary: r.summary ?? r.description ?? "",
      demands: r.demands ? JSON.parse(r.demands) : [],
      timeline: r.timeline ? JSON.parse(r.timeline) : [],
      hasTicker: r.has_ticker === "true",
    }));
  } catch {
    return mockCampaigns;
  }
}

const STATUS_SKIN: Record<string, string> = {
  Active: "bg-brand/15 text-brand-text border-brand/40",
  Won: "bg-term/10 text-term border-term/40",
  Lost: "bg-hi/10 text-hi border-hi/40",
};

export async function CampaignsSection() {
  const campaigns = await getCampaigns();
  const [featured, ...rest] = campaigns;
  const supporting = rest.slice(0, 2);

  if (!featured) return null;

  return (
    <section className="border-b border-line" id="campaigns">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">The fight</p>
            <h2 className="display mt-2 text-3xl sm:text-5xl">Campaigns</h2>
          </div>
          <Link href="/campaigns" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            All campaigns
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <Link
            href={`/chapters/${featured.chapterSlug}/campaigns/${featured.slug}`}
            className="group flex flex-col border border-line bg-cream p-6 lg:col-span-3 hover:border-brand transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${STATUS_SKIN[featured.status] ?? "border-line text-ink/60"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                {featured.status}
              </span>
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/40">{chapterLabel(featured.chapterSlug)}</span>
            </div>
            <h3 className="display mt-4 text-2xl leading-none">{featured.title}</h3>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">{featured.summary}</p>
            {featured.demands.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {featured.demands.slice(0, 2).map((d) => (
                  <li key={d} className="flex gap-2 text-[13px] text-ink/70">
                    <span className="accent shrink-0">{"\u25C6"}</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            <p className="mono mt-6 text-[12px] font-bold uppercase tracking-[0.12em] text-brand group-hover:underline group-hover:underline-offset-4">
              Read more →
            </p>
          </Link>

          <div className="flex flex-col gap-5 lg:col-span-2">
            {supporting.map((c) => (
              <Link
                key={`${c.chapterSlug}-${c.slug}`}
                href={`/chapters/${c.chapterSlug}/campaigns/${c.slug}`}
                className="group flex flex-1 flex-col border border-line bg-cream p-5 hover:border-brand transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ${STATUS_SKIN[c.status] ?? "border-line text-ink/60"}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    {c.status}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink/40">{chapterLabel(c.chapterSlug)}</span>
                </div>
                <h3 className="display mt-3 text-lg leading-none">{c.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/60 line-clamp-2">{c.summary}</p>
                <p className="mono mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-brand group-hover:underline group-hover:underline-offset-4">
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
