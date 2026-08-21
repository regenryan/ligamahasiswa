import { NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets-db";

export async function GET() {
  try {
    const rows = await readSheet("News");
    const sorted = rows
      .sort((a, b) => (b.fetched_at ?? "").localeCompare(a.fetched_at ?? ""))
      .slice(0, 20)
      .map((r) => ({
        outlet: r.outlet ?? "",
        title: r.title ?? "",
        url: r.url ?? "",
        imageUrl: r.image_url ?? "",
        fetchedAt: r.fetched_at ?? "",
      }));

    return NextResponse.json({ ok: true, items: sorted });
  } catch {
    return NextResponse.json({ ok: true, items: [] });
  }
}
