export const config = {
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "",
  appsScriptApiKey: process.env.APPS_SCRIPT_API_KEY ?? "",
  hitpayApiKey: process.env.HITPAY_API_KEY ?? "",
  hitpaySalt: process.env.HITPAY_SALT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app",
  sessionSecret: process.env.SESSION_SECRET ?? "",
} as const;
