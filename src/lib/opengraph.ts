export interface OGMetadata {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

export async function fetchOGMetadata(url: string): Promise<OGMetadata | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LigaBot/1.0)",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();

    const getMeta = (name: string): string => {
      const ogMatch = html.match(new RegExp(`<meta[^>]*property="${name}"[^>]*content="([^"]*)"`, "i"));
      if (ogMatch) return ogMatch[1];

      const nameMatch = html.match(new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, "i"));
      if (nameMatch) return nameMatch[1];

      return "";
    };

    return {
      title: getMeta("og:title") || getMeta("title"),
      description: getMeta("og:description") || getMeta("description"),
      image: getMeta("og:image"),
      siteName: getMeta("og:site_name"),
    };
  } catch {
    return null;
  }
}
