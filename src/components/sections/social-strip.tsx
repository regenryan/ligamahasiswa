import Link from "next/link";
import { readSheet } from "@/lib/sheets-db";
import { SectionHead } from "@/components/sections/head";

const PLATFORM_SKIN: Record<string, string> = {
  instagram: "border-pink/40 bg-pink/10 text-pink",
  tiktok: "border-ink/40 bg-ink/10 text-ink",
  youtube: "border-brand/40 bg-brand/10 text-brand-text",
  x: "border-ink/40 bg-ink/10 text-ink",
  twitter: "border-ink/40 bg-ink/10 text-ink",
};

export async function SocialStrip() {
  let posts: { id: string; platform: string; url: string; caption: string; thumbnail: string }[] = [];
  try {
    const rows = await readSheet("Social");
    posts = rows.slice(0, 6).map((r) => ({
      id: r.id ?? `social-${r.url}`,
      platform: (r.platform ?? "instagram").toLowerCase(),
      url: r.url ?? "#",
      caption: r.caption ?? "",
      thumbnail: r.thumbnail ?? "",
    }));
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead index={1} title="Follow the movement" sub="Latest from our social channels." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="border border-line bg-cream p-4 hover:border-brand transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${PLATFORM_SKIN[p.platform] ?? "border-line text-ink/60"}`}>
                  {p.platform}
                </span>
              </div>
              <p className="mt-2 text-[14px] text-ink/70 line-clamp-2">{p.caption}</p>
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/social" className="press inline-flex border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink transition-colors">
            View all social
          </Link>
        </div>
      </div>
    </section>
  );
}
