import { Shell } from "@/components/shells";
import { PageHead, SectionHead, JoinBand, NewsletterBand } from "@/components/sections";
import { readSheet } from "@/lib/sheets-db";
import { getYouTubeVideos } from "@/lib/youtube";
import { config } from "@/lib/config";
import Link from "next/link";

const DIR = 27;
const YT_CHANNEL_ID = "";

type SocialPost = {
  id: string;
  platform: string;
  url: string;
  caption: string;
  thumbnail: string;
  date: string;
};

async function getSocialPosts(): Promise<SocialPost[]> {
  try {
    const rows = await readSheet("Social");
    return rows.map((r) => ({
      id: r.id ?? `social-${r.url}`,
      platform: (r.platform ?? "instagram").toLowerCase(),
      url: r.url ?? "#",
      caption: r.caption ?? "",
      thumbnail: r.thumbnail ?? "",
      date: r.date ?? r.created_at ?? "",
    }));
  } catch {
    return [];
  }
}

async function getYoutubeFeed(): Promise<SocialPost[]> {
  if (!config.youtubeApiKey || !YT_CHANNEL_ID) return [];
  const videos = await getYouTubeVideos(YT_CHANNEL_ID, 12);
  return videos.map((v) => ({
    id: `yt-${v.id}`,
    platform: "youtube",
    url: v.url,
    caption: v.title,
    thumbnail: v.thumbnail,
    date: v.publishedAt,
  }));
}

const PLATFORM_SKIN: Record<string, string> = {
  instagram: "border-pink/40 bg-pink/10 text-pink",
  tiktok: "border-ink/40 bg-ink/10 text-ink",
  youtube: "border-brand/40 bg-brand/10 text-brand-text",
  x: "border-ink/40 bg-ink/10 text-ink",
  twitter: "border-ink/40 bg-ink/10 text-ink",
};

function platformIcon(p: string) {
  if (p === "instagram") return "IG";
  if (p === "tiktok") return "TT";
  if (p === "youtube") return "YT";
  if (p === "x" || p === "twitter") return "X";
  return p.slice(0, 2).toUpperCase();
}

function InstagramEmbed({ url }: { url: string }) {
  const match = url.match(/\/p\/([^/]+)/);
  if (!match) return null;
  return (
    <iframe
      src={`https://www.instagram.com/p/${match[1]}/embed/`}
      className="w-full border-0"
      loading="lazy"
      title="Instagram post"
    />
  );
}

function TikTokEmbed({ url }: { url: string }) {
  const match = url.match(/\/video\/(\d+)/);
  if (!match) return null;
  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-video-id={match[1]}
      style={{ maxWidth: "605px", minWidth: "325px" }}
    />
  );
}

function YouTubeCard({ post }: { post: SocialPost }) {
  const videoId = post.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
  if (!videoId) {
    return (
      <a href={post.url} target="_blank" rel="noreferrer" className="block border border-line bg-cream hover:border-brand transition-colors">
        {post.thumbnail ? <img src={post.thumbnail} alt="" className="aspect-video w-full object-cover" /> : null}
        <div className="p-4">
          <p className="text-[14px] font-bold">{post.caption}</p>
        </div>
      </a>
    );
  }
  return (
    <div className="border border-line bg-cream">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={post.caption}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-[14px] font-bold">{post.caption}</p>
      </div>
    </div>
  );
}

export default async function SocialPage() {
  const [posts, ytFeed] = await Promise.all([getSocialPosts(), getYoutubeFeed()]);

  const allPosts = [...posts, ...ytFeed].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const platforms = [...new Set(allPosts.map((p) => p.platform))];

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Social"
        title="Social"
        sub="Follow the movement across platforms."
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={1} title="Latest posts" sub="Instagram, TikTok, and YouTube from Liga Mahasiswa." />

          {allPosts.length === 0 ? (
            <div className="border border-dashed border-line p-8 text-center">
              <p className="text-[14px] text-ink/50">No posts yet. Follow us on our social channels.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post) => {
                if (post.platform === "youtube") {
                  return <YouTubeCard key={post.id} post={post} />;
                }
                return (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-line bg-cream hover:border-brand transition-colors"
                  >
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" className="aspect-square w-full object-cover" />
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-midnight">
                        <span className="display text-4xl text-fog/30">{platformIcon(post.platform)}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${PLATFORM_SKIN[post.platform] ?? "border-line text-ink/60"}`}>
                          {post.platform}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] text-ink/70 line-clamp-3">{post.caption}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="border-b border-line bg-midnight">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead index={2} title="Follow us" sub="Join the conversation across platforms." />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a href="https://instagram.com/ligamahasiswa" target="_blank" rel="noreferrer" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <p className="display text-xl text-fog">Instagram</p>
              <p className="mt-2 text-[13px] text-fog/60">@ligamahasiswa</p>
            </a>
            <a href="https://tiktok.com/@ligamahasiswa" target="_blank" rel="noreferrer" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <p className="display text-xl text-fog">TikTok</p>
              <p className="mt-2 text-[13px] text-fog/60">@ligamahasiswa</p>
            </a>
            <a href="https://youtube.com/@ligamahasiswa" target="_blank" rel="noreferrer" className="border border-fog/20 bg-fog/5 p-6 hover:border-brand transition-colors">
              <p className="display text-xl text-fog">YouTube</p>
              <p className="mt-2 text-[13px] text-fog/60">@ligamahasiswa</p>
            </a>
          </div>
        </div>
      </section>
      <JoinBand />
      <NewsletterBand />
    </Shell>
  );
}
