import { db } from "./db";
import { roleRecord, rolePermission, role as roleTable, permission as permTable } from "./schema";
import { eq } from "drizzle-orm";

const ROLE_HIERARCHY: Record<string, number> = {
  user: 0,
  member: 1,
  committee: 2,
  highcommittee: 3,
  admin: 4,
};

export async function getUserRoles(userId: string): Promise<string[]> {
  const records = await db
    .select({ roleName: roleTable.name })
    .from(roleRecord)
    .innerJoin(roleTable, eq(roleRecord.roleId, roleTable.roleId))
    .where(eq(roleRecord.userId, userId));

  return records.map((r) => r.roleName);
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const userRoles = await getUserRoles(userId);
  if (userRoles.length === 0) return [];
  
  if (userRoles.includes("admin")) {
    // Admin has all permissions
    const allPerms = await db.select().from(permTable);
    return allPerms.map(p => p.name);
  }

  // Get all roles that are at or below the user's highest role in hierarchy
  const highestLevel = Math.max(...userRoles.map(r => ROLE_HIERARCHY[r] ?? 0));
  const inheritedRoles = Object.keys(ROLE_HIERARCHY).filter(r => ROLE_HIERARCHY[r] <= highestLevel);

  // Since we're keeping it simple, we fetch all role records that match
  const validRoles = Array.from(new Set([...userRoles, ...inheritedRoles]));

  const perms = await db
    .select({ roleName: roleTable.name, permName: permTable.name })
    .from(rolePermission)
    .innerJoin(roleTable, eq(rolePermission.roleId, roleTable.roleId))
    .innerJoin(permTable, eq(rolePermission.permissionId, permTable.permissionId));

  // Filter by roles in the valid set
  const userPerms = perms
    .filter((p) => validRoles.includes(p.roleName))
    .map((p) => p.permName);

  return Array.from(new Set(userPerms));
}

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permissionName);
}

export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes(roleName);
}

export async function hasMinimumRole(userId: string, minRole: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  const minLevel = ROLE_HIERARCHY[minRole] ?? 0;
  return roles.some((r) => (ROLE_HIERARCHY[r] ?? 0) >= minLevel);
}

export function checkRoleHierarchy(creatorRole: string, targetRole: string): boolean {
  const creatorLevel = ROLE_HIERARCHY[creatorRole] ?? 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] ?? 0;
  return creatorLevel > targetLevel;
}
