export const config = {
  appsScriptUrl: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "",
  hitpayApiKey: process.env.NEXT_PUBLIC_HITPAY_API_KEY ?? "",
  hitpayApiSecret: process.env.NEXT_PUBLIC_HITPAY_API_SECRET ?? "",
  hitpayMerchantId: process.env.NEXT_PUBLIC_HITPAY_MERCHANT_ID ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligamahasiswamalaysia.vercel.app",
} as const;
