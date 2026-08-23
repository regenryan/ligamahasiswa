import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/hash";
import { writeSheet, findRow, updateSheet } from "@/lib/sheets-db";

const SEED_SECRET = process.env.SEED_SECRET;

const ACCOUNTS = [
  { name: "Admin User", email: "admin@liga.my", role: "admin", status: "active", chapter: "malaysia" },
  { name: "National User", email: "national@liga.my", role: "national", status: "active", chapter: "malaysia" },
  { name: "President User", email: "president@liga.my", role: "committee", status: "active", chapter: "um" },
  { name: "Secretary User", email: "secretary@liga.my", role: "committee", status: "active", chapter: "um" },
  { name: "Member User", email: "member@liga.my", role: "member", status: "active", chapter: "um" },
  { name: "Expired User", email: "expired@liga.my", role: "member", status: "expired", chapter: "utm" },
  { name: "Suspended User", email: "suspended@liga.my", role: "member", status: "suspended", chapter: "usm" },
  { name: "Basic User", email: "user@liga.my", role: "user", status: "active", chapter: "unisza" },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = body?.secret ?? request.headers.get("x-seed-secret");

  if (!SEED_SECRET || secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { email: string; ok: boolean; error?: string; action: string }[] = [];
  const password = "password123";

  for (const acct of ACCOUNTS) {
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const userId = `seed_${acct.role}_${acct.email.split("@")[0]}`;
    const memberId = `LMM-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    const updates = {
      id: userId,
      name: acct.name,
      email: acct.email,
      password_hash: passwordHash,
      phone: "",
      chapter_slug: acct.chapter,
      role: acct.role,
      status: acct.status,
      member_id: memberId,
      membership_paid_at: acct.role === "member" ? now : "",
      membership_expires_at: acct.role === "member"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : "",
      avatar_url: "",
      created_at: now,
      updated_at: now,
    };

    const existing = await findRow("Users", "email", acct.email);
    let result;

    if (existing) {
      result = await updateSheet("Users", "email", acct.email, updates);
      results.push({ email: acct.email, ok: result.ok, error: result.error, action: "updated" });
    } else {
      result = await writeSheet("Users", updates);
      results.push({ email: acct.email, ok: result.ok, error: result.error, action: "created" });
    }
  }

  return NextResponse.json({ seeded: results.length, results });
}
