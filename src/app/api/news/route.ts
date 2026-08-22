import { NextRequest, NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const topic = searchParams.get("topic") ?? "";

    const rows = await readSheet("News");

    let sorted = rows.sort((a, b) => (b.fetched_at ?? "").localeCompare(a.fetched_at ?? ""));

    if (topic) {
      sorted = sorted.filter((r) => {
        const title = (r.title ?? "").toLowerCase();
        const outlet = (r.outlet ?? "").toLowerCase();
        return title.includes(topic.toLowerCase()) || outlet.includes(topic.toLowerCase());
      });
    }

    const total = sorted.length;
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit).map((r) => ({
      outlet: r.outlet ?? "",
      title: r.title ?? "",
      url: r.url ?? "",
      imageUrl: r.image_url ?? "",
      fetchedAt: r.fetched_at ?? "",
      topic: r.topic ?? "",
    }));

    return NextResponse.json({ ok: true, items, total, page, limit });
  } catch {
    return NextResponse.json({ ok: true, items: [], total: 0, page: 1, limit: 20 });
  }
}
