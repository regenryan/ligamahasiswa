import { cache } from "react";
import { config } from "@/lib/config";

type SheetName =
  | "Users"
  | "Chapters"
  | "Campaigns"
  | "Events"
  | "RSVPs"
  | "Statements"
  | "Gallery"
  | "Products"
  | "Orders"
  | "Zines"
  | "Likes"
  | "PRK_Nominations"
  | "Newsletter"
  | "Contact"
  | "News"
  | "Constitution"
  | "Committee"
  | "Social";

type ReadOptions = {
  filters?: Record<string, string>;
  limit?: number;
  offset?: number;
};

async function rawRequest(
  params: Record<string, string>,
): Promise<unknown> {
  if (!config.appsScriptUrl) {
    throw new Error("Apps Script URL not configured");
  }
  const url = new URL(config.appsScriptUrl);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  if (config.appsScriptApiKey) {
    url.searchParams.set("key", config.appsScriptApiKey);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Sheets API error: ${res.status}`);
  }
  return res.json();
}

async function readSheetImpl(
  sheet: SheetName,
  options?: ReadOptions | Record<string, string>,
): Promise<Record<string, string>[]> {
  const opts: ReadOptions = options && "filters" in options ? options : { filters: options as Record<string, string> | undefined };
  const params: Record<string, string> = { sheet, action: "read" };
  if (opts.filters) {
    for (const [k, v] of Object.entries(opts.filters)) {
      params[`filter_${k}`] = v;
    }
  }
  const data = (await rawRequest(params)) as {
    rows?: Record<string, string>[];
  };
  let rows = data.rows ?? [];
  if (opts.offset && opts.offset > 0) {
    rows = rows.slice(opts.offset);
  }
  if (opts.limit && opts.limit > 0) {
    rows = rows.slice(0, opts.limit);
  }
  return rows;
}

export const readSheet = cache(readSheetImpl) as typeof readSheetImpl;

export async function findRow(
  sheet: SheetName,
  field: string,
  value: string,
): Promise<Record<string, string> | null> {
  const params: Record<string, string> = {
    sheet,
    action: "find",
    field,
    value,
  };
  const data = (await rawRequest(params)) as { row?: Record<string, string> };
  return data.row ?? null;
}

export async function writeSheet(
  sheet: SheetName,
  row: Record<string, string>,
): Promise<{ ok: boolean; _row?: number; error?: string }> {
  if (!config.appsScriptUrl) {
    return { ok: false, error: "Apps Script URL not configured" };
  }
  try {
    const res = await fetch(config.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ _sheet: sheet, _row: row }),
      headers: { "Content-Type": "text/plain" },
    });
    void res;
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Write failed",
    };
  }
}

export async function updateSheet(
  sheet: SheetName,
  matchField: string,
  matchValue: string,
  updates: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  if (!config.appsScriptUrl) {
    return { ok: false, error: "Apps Script URL not configured" };
  }
  try {
    const res = await fetch(config.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        _sheet: sheet,
        _action: "update",
        _matchField: matchField,
        _matchValue: matchValue,
        _updates: updates,
      }),
      headers: { "Content-Type": "text/plain" },
    });
    void res;
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Update failed",
    };
  }
}

export type { SheetName, ReadOptions };
