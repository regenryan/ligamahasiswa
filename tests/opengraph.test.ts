import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchOGMetadata } from "@/lib/opengraph";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

function mockFetchResponse(body: string, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue(
    new Response(body, { status, headers: { "Content-Type": "text/html" } }),
  ) as unknown as typeof fetch;
}

describe("fetchOGMetadata", () => {
  it("parses Open Graph meta tags", async () => {
    mockFetchResponse(
      `<html><head>
        <meta property="og:title" content="Mansuh AUKU">
        <meta property="og:description" content="Campaign description">
        <meta property="og:image" content="https://img.example.com/a.png">
        <meta property="og:site_name" content="Liga Mahasiswa">
      </head></html>`,
    );

    const meta = await fetchOGMetadata("https://example.com/p");
    expect(meta).toEqual({
      title: "Mansuh AUKU",
      description: "Campaign description",
      image: "https://img.example.com/a.png",
      siteName: "Liga Mahasiswa",
    });
  });

  it("falls back to name= attributes for title and description", async () => {
    mockFetchResponse(
      `<html><head>
        <title>Fallback Title</title>
        <meta name="description" content="Fallback desc">
      </head></html>`,
    );

    const meta = await fetchOGMetadata("https://example.com/fallback");
    expect(meta?.title).toBe("Fallback Title");
    expect(meta?.description).toBe("Fallback desc");
    expect(meta?.image).toBe("");
    expect(meta?.siteName).toBe("");
  });

  it("prefers og: over name= when both exist", async () => {
    mockFetchResponse(
      `<html><head>
        <meta property="og:title" content="OG">
        <title>Plain</title>
      </head></html>`,
    );

    const meta = await fetchOGMetadata("https://example.com/t");
    expect(meta?.title).toBe("OG");
  });

  it("returns null for a non-OK response", async () => {
    mockFetchResponse("not found", false, 404);
    expect(await fetchOGMetadata("https://example.com/404")).toBeNull();
  });

  it("returns null when the request throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;
    expect(await fetchOGMetadata("https://example.com/down")).toBeNull();
  });
});
