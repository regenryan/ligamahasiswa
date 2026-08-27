import { cache } from "react";
import { db } from "./db";
import { config as configTable } from "./schema";
import { eq } from "drizzle-orm";

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app",
  sessionSecret: process.env.SESSION_SECRET ?? "",
} as const;

// Backward-compatible alias for existing code (to be removed in Phase 3)
export const config = {
  siteUrl: siteConfig.siteUrl,
  sessionSecret: siteConfig.sessionSecret,
  hitpayApiKey: process.env.HITPAY_API_KEY ?? "",
  hitpaySalt: process.env.HITPAY_SALT ?? "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "",
  appsScriptApiKey: process.env.APPS_SCRIPT_API_KEY ?? "",
} as const;

const configCache = new Map<string, { value: string; ts: number }>();
const CONFIG_TTL = 60_000;

export async function getConfigValue(key: string): Promise<string | null> {
  const cached = configCache.get(key);
  if (cached && Date.now() - cached.ts < CONFIG_TTL) return cached.value;

  try {
    const rows = await db.select().from(configTable).where(eq(configTable.key, key));
    if (rows[0]?.value) {
      configCache.set(key, { value: rows[0].value, ts: Date.now() });
      return rows[0].value;
    }
  } catch {
    // Config table may not exist yet
  }
  return null;
}

export async function getMembershipFee(): Promise<number> {
  const val = await getConfigValue("member_fee");
  return val ? Number(val) : 10;
}

export async function getMembershipDurationDays(): Promise<number> {
  const val = await getConfigValue("member_duration");
  return val ? Number(val) : 365;
}
