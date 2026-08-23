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
  | "Social"
  | "Config"
  | "CommitteePositions"
  | "CommitteeApprovals";

type ReadOptions = {
  filters?: Record<string, string>;
  limit?: number;
  offset?: number;
};

function buildUrl(params: Record<string, string>): string {
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
  return url.toString();
}

async function doGetRequest(
  params: Record<string, string>,
): Promise<unknown> {
  const url = buildUrl(params);
  const res = await fetch(url);
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
  const data = (await doGetRequest(params)) as {
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
  const data = (await doGetRequest(params)) as { row?: Record<string, string> };
  return data.row ?? null;
}

export async function writeSheet(
  sheet: SheetName,
  row: Record<string, string>,
): Promise<{ ok: boolean; _row?: number; error?: string }> {
  try {
    const params: Record<string, string> = {
      sheet,
      action: "write",
      row_data: JSON.stringify(row),
    };
    const data = (await doGetRequest(params)) as {
      ok?: boolean;
      _row?: number;
      error?: string;
    };
    if (data.error) {
      return { ok: false, error: data.error };
    }
    return { ok: true, _row: data._row };
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
  try {
    const params: Record<string, string> = {
      sheet,
      action: "update",
      matchField,
      matchValue,
      updates_data: JSON.stringify(updates),
    };
    const data = (await doGetRequest(params)) as {
      ok?: boolean;
      error?: string;
    };
    if (data.error) {
      return { ok: false, error: data.error };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Update failed",
    };
  }
}

export type { SheetName, ReadOptions };
