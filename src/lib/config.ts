import { findRow } from "./sheets-db";

export const config = {
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "",
  appsScriptApiKey: process.env.APPS_SCRIPT_API_KEY ?? "",
  hitpayApiKey: process.env.HITPAY_API_KEY ?? "",
  hitpaySalt: process.env.HITPAY_SALT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app",
  sessionSecret: process.env.SESSION_SECRET ?? "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
} as const;

const configCache = new Map<string, { value: string; ts: number }>();
const CONFIG_TTL = 60_000;

export async function getConfigValue(key: string): Promise<string | null> {
  const cached = configCache.get(key);
  if (cached && Date.now() - cached.ts < CONFIG_TTL) return cached.value;

  try {
    const row = await findRow("Config", "key", key);
    if (row?.value) {
      configCache.set(key, { value: row.value, ts: Date.now() });
      return row.value;
    }
  } catch {
    // Config sheet may not exist yet
  }
  return null;
}

export async function getMembershipFee(): Promise<number> {
  const val = await getConfigValue("membership_fee");
  return val ? Number(val) : 10;
}

export async function getMembershipDurationDays(): Promise<number> {
  const val = await getConfigValue("membership_duration_days");
  return val ? Number(val) : 365;
}
