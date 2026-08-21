export const config = {
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "",
  hitpayApiKey: process.env.HITPAY_API_KEY ?? "",
  hitpaySalt: process.env.HITPAY_SALT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswa.vercel.app",
} as const;
