import { NextResponse } from "next/server";
import { readSheet, updateSheet, type SheetName } from "@/lib/sheets-db";

const MIGRATE_SECRET = process.env.MIGRATE_SECRET;

const SLUG_MAP: Record<string, string> = {
  malaysia: "ligamy",
  um: "ligaum",
  utm: "ligautm",
  usm: "ligausm",
  unisza: "ligaunisza",
  utem: "sparcutem",
};

const SHEETS: { name: SheetName; matchFields: string[] }[] = [
  { name: "Campaigns", matchFields: ["id", "slug"] },
  { name: "Events", matchFields: ["id", "slug"] },
  { name: "Posts" as SheetName, matchFields: ["id", "slug", "title"] },
  { name: "Statements", matchFields: ["id", "slug", "title"] },
  { name: "Zines", matchFields: ["id", "slug", "title"] },
  { name: "Articles" as SheetName, matchFields: ["id", "slug", "title"] },
  { name: "Users", matchFields: ["id", "email", "username"] },
  { name: "Orders", matchFields: ["id", "order_no"] },
  { name: "Committee", matchFields: ["id", "username"] },
  { name: "PRK_Nominations" as SheetName, matchFields: ["id", "username"] },
  { name: "RSVPs", matchFields: ["id", "user_id"] },
  { name: "Memberships" as SheetName, matchFields: ["id", "username"] },
  { name: "Replies" as SheetName, matchFields: ["id"] },
];

type Row = Record<string, string>;

type SheetResult = {
  sheet: string;
  scanned: number;
  updated: number;
  failed: number;
  skipped: number;
  errors: string[];
};

function resolveMatch(
  row: Row,
  candidates: string[],
): { field: string; value: string } | null {
  for (const field of candidates) {
    const value = row[field];
    if (value) return { field, value };
  }
  return null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret =
    url.searchParams.get("secret") ?? request.headers.get("x-migrate-secret");

  if (!MIGRATE_SECRET || secret !== MIGRATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: SheetResult[] = [];

  for (const { name, matchFields } of SHEETS) {
    const result: SheetResult = {
      sheet: name,
      scanned: 0,
      updated: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    let rows: Row[];
    try {
      rows = await readSheet(name);
    } catch (err) {
      result.errors.push(
        err instanceof Error ? err.message : `Failed to read ${name}`,
      );
      results.push(result);
      continue;
    }

    result.scanned = rows.length;

    for (const row of rows) {
      const oldSlug = row.chapter_slug ?? "";
      const newSlug = SLUG_MAP[oldSlug];
      if (!newSlug) continue;

      const match = resolveMatch(row, matchFields);
      if (!match) {
        result.skipped += 1;
        result.errors.push(
          `${name}: row with chapter_slug "${oldSlug}" has no usable match field`,
        );
        continue;
      }

      const update = await updateSheet(name, match.field, match.value, {
        chapter_slug: newSlug,
      });

      if (update.ok) {
        result.updated += 1;
      } else {
        result.failed += 1;
        result.errors.push(
          `${name} (${match.field}=${match.value}): ${update.error ?? "Update failed"}`,
        );
      }
    }

    results.push(result);
  }

  const migrated = results.reduce((sum, r) => sum + r.updated, 0);

  return NextResponse.json({ migrated, results });
}
