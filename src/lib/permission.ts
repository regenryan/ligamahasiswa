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
  const roles = await getUserRoles(userId);
  if (roles.length === 0) return [];

  const perms = await db
    .select({ permName: permTable.name })
    .from(rolePermission)
    .innerJoin(permTable, eq(rolePermission.permissionId, permTable.permissionId))
    .where(
      eq(rolePermission.roleId, roles[0])
    );

  // TODO: union all role permissions, not just first role
  return perms.map((p) => p.permName);
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
