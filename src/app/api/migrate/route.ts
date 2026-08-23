import { NextResponse } from "next/server";
import { readSheet, updateSheet } from "@/lib/sheets-db";

const MIGRATE_SECRET = process.env.MIGRATE_SECRET;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = body?.secret ?? request.headers.get("x-migrate-secret");

  if (!MIGRATE_SECRET || secret !== MIGRATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await readSheet("Users");
  const results: { id: string; email: string; oldStatus: string; newRole: string; newStatus: string; ok: boolean }[] = [];

  for (const user of users) {
    const oldStatus = user.status ?? "";
    let newRole = user.role ?? "user";
    let newStatus = user.status ?? "active";

    if (oldStatus === "approved") {
      newRole = "member";
      newStatus = "active";
    } else if (oldStatus === "pending") {
      newRole = "user";
      newStatus = "active";
    } else if (oldStatus === "rejected") {
      newRole = "user";
      newStatus = "suspended";
    }

    if (newRole !== user.role || newStatus !== user.status) {
      const result = await updateSheet("Users", "id", user.id, {
        role: newRole,
        status: newStatus,
      });
      results.push({
        id: user.id,
        email: user.email,
        oldStatus,
        newRole,
        newStatus,
        ok: result.ok,
      });
    }
  }

  return NextResponse.json({ migrated: results.length, results });
}
