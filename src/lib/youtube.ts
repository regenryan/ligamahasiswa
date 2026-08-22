import { config } from "@/lib/config";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url: string;
};

export async function getYouTubeVideos(
  channelId: string,
  maxResults = 12,
): Promise<YouTubeVideo[]> {
  if (!config.youtubeApiKey || !channelId) return [];

  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    maxResults: String(maxResults),
    order: "date",
    type: "video",
    key: config.youtubeApiKey,
  });

  const res = await fetch(`${YT_BASE}/search?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    items: {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        thumbnails: { high?: { url: string }; default?: { url: string } };
        publishedAt: string;
        channelTitle: string;
      };
    }[];
  };

  return (data.items ?? []).map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? "",
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}

export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
