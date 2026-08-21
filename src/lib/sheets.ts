import { config } from "@/lib/config";

type SheetName = "Members" | "Newsletter" | "Orders" | "Contact";

export async function submitToSheet(
  sheet: SheetName,
  row: (string | number | boolean)[],
): Promise<{ ok: boolean; error?: string }> {
  if (!config.appsScriptUrl) {
    return { ok: false, error: "Apps Script URL not configured" };
  }

  try {
    const payload = JSON.stringify({ _sheet: sheet, _row: row });

    const res = await fetch(config.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: payload,
      headers: { "Content-Type": "text/plain" },
    });

    void res;
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Submission failed",
    };
  }
}

export function submitJoinForm(data: {
  name: string;
  email: string;
  chapter: string;
  agreed: boolean;
}) {
  return submitToSheet("Members", [
    new Date().toISOString(),
    data.name,
    data.email,
    data.chapter,
    data.agreed ? "Yes" : "No",
    "website",
  ]);
}

export function submitNewsletter(email: string) {
  return submitToSheet("Newsletter", [
    new Date().toISOString(),
    email,
    "website",
  ]);
}

export function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return submitToSheet("Contact", [
    new Date().toISOString(),
    data.name,
    data.email,
    data.subject,
    data.message,
  ]);
}

export function submitOrder(data: {
  name: string;
  email: string;
  items: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}) {
  return submitToSheet("Orders", [
    new Date().toISOString(),
    data.name,
    data.email,
    data.items,
    data.total,
    data.paymentMethod,
    data.paymentStatus,
  ]);
}
