import "server-only";
import { getSession, type SessionPayload } from "@/lib/session";
import { findRow } from "@/lib/sheets-db";
import { cache } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  chapterSlug: string;
  role: SessionPayload["role"];
  status: SessionPayload["status"];
  memberId: string;
  avatarUrl: string;
  createdAt: string;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  const row = await findRow("Users", "id", session.userId);
  if (!row) return null;

  return {
    id: row.id ?? "",
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    chapterSlug: row.chapter_slug ?? "",
    role: (row.role as SessionPayload["role"]) ?? "user",
    status: (row.status as SessionPayload["status"]) ?? "pending",
    memberId: row.member_id ?? "",
    avatarUrl: row.avatar_url ?? "",
    createdAt: row.created_at ?? "",
  };
});

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireMember(): Promise<User> {
  const user = await requireAuth();
  if (user.status !== "approved") {
    throw new Error("Member approval required");
  }
  return user;
}
