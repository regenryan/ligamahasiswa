import "server-only";
import { getSession, type SessionPayload, type UserRole } from "@/lib/session";
import { findRow } from "@/lib/sheets-db";
import { cache } from "react";

const ROLE_LEVELS: Record<UserRole, number> = {
  user: 0,
  member: 1,
  committee: 2,
  national: 3,
  admin: 4,
};

export function hasRole(role: UserRole, min: UserRole): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS[min];
}

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
  membershipPaidAt: string;
  membershipExpiresAt: string;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  const row = await findRow("Users", "id", session.userId);
  if (!row) return null;

  const expiresAt = row.membership_expires_at ?? "";
  const now = new Date().toISOString();
  let status = (row.status as SessionPayload["status"]) ?? "active";

  if (status === "active" && row.role === "member" && expiresAt && expiresAt < now) {
    status = "expired";
  }

  return {
    id: row.id ?? "",
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    chapterSlug: row.chapter_slug ?? "",
    role: (row.role as SessionPayload["role"]) ?? "user",
    status,
    memberId: row.member_id ?? "",
    avatarUrl: row.avatar_url ?? "",
    createdAt: row.created_at ?? "",
    membershipPaidAt: row.membership_paid_at ?? "",
    membershipExpiresAt: expiresAt,
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
  if (!hasRole(user.role, "member") || user.status !== "active") {
    throw new Error("Member access required");
  }
  return user;
}
