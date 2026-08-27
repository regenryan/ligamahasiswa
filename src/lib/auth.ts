import "server-only";
import { cache } from "react";
import { eq, and, gt } from "drizzle-orm";
import { db } from "./db";
import { user, member, roleRecord, role } from "./schema";
import { getSession } from "./session";

const ROLE_LEVELS: Record<string, number> = {
  user: 0,
  member: 1,
  committee: 2,
  highcommittee: 3,
  admin: 4,
};

export function hasRole(role: string, min: string): boolean {
  return (ROLE_LEVELS[role] ?? 0) >= (ROLE_LEVELS[min] ?? 0);
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  chapterSlug: string;
  role: string;
  status: string;
  memberId: string;
  avatarUrl: string;
  createdAt: string;
  membershipPaidAt: string;
  membershipExpiresAt: string;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  // Fetch user from DB
  const rows = await db.select().from(user).where(eq(user.userId, session.userId));
  const u = rows[0];
  if (!u || u.deletedAt) return null;

  // Fetch highest role
  const roles = await db
    .select({ roleName: role.name })
    .from(roleRecord)
    .innerJoin(role, eq(roleRecord.roleId, role.roleId))
    .where(eq(roleRecord.userId, session.userId));

  let highestRole = "user";
  let highestLevel = 0;
  for (const r of roles) {
    const level = ROLE_LEVELS[r.roleName] ?? 0;
    if (level > highestLevel) {
      highestLevel = level;
      highestRole = r.roleName;
    }
  }

  // Fetch membership
  const memberRows = await db
    .select()
    .from(member)
    .where(eq(member.userId, session.userId));

  const m = memberRows[0];
  const now = new Date();
  let status = "active";

  if (m) {
    if (m.expiresAt < now) {
      status = "expired";
    }
  }

  return {
    id: u.userId,
    name: u.name ?? "",
    email: u.email,
    phone: u.phone ?? "",
    chapterSlug: "", // Will be populated from roleRecord chapter assignment
    role: highestRole,
    status,
    memberId: m?.memberId ?? "",
    avatarUrl: u.avatar ?? "",
    createdAt: u.createdAt ? String(u.createdAt) : "",
    membershipPaidAt: m?.paidAt ? String(m.paidAt) : "",
    membershipExpiresAt: m?.expiresAt ? String(m.expiresAt) : "",
  };
});

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireMember(): Promise<User> {
  const u = await requireAuth();
  if (!hasRole(u.role, "member") || u.status !== "active") {
    throw new Error("Member access required");
  }
  return u;
}
