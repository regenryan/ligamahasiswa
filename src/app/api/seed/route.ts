import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  chapter, user, member, role, permission, rolePermission, roleRecord, config,
} from "@/lib/schema";
import { hashPassword } from "@/lib/password";

const SEED_SECRET = process.env.SEED_SECRET;

function nanoid(): string {
  return crypto.randomUUID();
}

const CHAPTERS = [
  { chapterId: nanoid(), slug: "ligamy", name: "Liga Mahasiswa Malaysia", type: "national" },
  { chapterId: nanoid(), slug: "ligaum", name: "Liga Mahasiswa UM", type: "university" },
  { chapterId: nanoid(), slug: "ligautm", name: "Liga Mahasiswa UTM", type: "university" },
  { chapterId: nanoid(), slug: "ligausm", name: "Liga Mahasiswa USM", type: "university" },
  { chapterId: nanoid(), slug: "ligaunisza", name: "Liga Mahasiswa UniSZA", type: "university" },
  { chapterId: nanoid(), slug: "sparcutem", name: "SPARC UTeM", type: "university" },
  { chapterId: nanoid(), slug: "ligaalumni", name: "Liga Alumni", type: "alumni" },
];

const PERMISSIONS = [
  // Campaign
  { permissionId: nanoid(), name: "campaign:create", description: "Create campaigns" },
  { permissionId: nanoid(), name: "campaign:edit", description: "Edit campaigns" },
  { permissionId: nanoid(), name: "campaign:delete", description: "Delete campaigns" },
  { permissionId: nanoid(), name: "campaign:view", description: "View campaigns" },
  // Event
  { permissionId: nanoid(), name: "event:create", description: "Create events" },
  { permissionId: nanoid(), name: "event:edit", description: "Edit events" },
  { permissionId: nanoid(), name: "event:delete", description: "Delete events" },
  { permissionId: nanoid(), name: "event:view", description: "View events" },
  // Media
  { permissionId: nanoid(), name: "media:create", description: "Create media" },
  { permissionId: nanoid(), name: "media:edit", description: "Edit media" },
  { permissionId: nanoid(), name: "media:delete", description: "Delete media" },
  { permissionId: nanoid(), name: "media:view", description: "View media" },
  // Product
  { permissionId: nanoid(), name: "product:create", description: "Create products" },
  { permissionId: nanoid(), name: "product:edit", description: "Edit products" },
  { permissionId: nanoid(), name: "product:delete", description: "Delete products" },
  { permissionId: nanoid(), name: "product:view", description: "View products" },
  { permissionId: nanoid(), name: "product:approve", description: "Approve products" },
  // Member
  { permissionId: nanoid(), name: "member:view", description: "View members" },
  { permissionId: nanoid(), name: "member:promote", description: "Promote members" },
  { permissionId: nanoid(), name: "member:suspend", description: "Suspend members" },
  // Role
  { permissionId: nanoid(), name: "role:create", description: "Create roles" },
  { permissionId: nanoid(), name: "role:assign", description: "Assign roles" },
  { permissionId: nanoid(), name: "role:revoke", description: "Revoke roles" },
  // Nomination
  { permissionId: nanoid(), name: "nomination:view", description: "View nominations" },
  { permissionId: nanoid(), name: "nomination:edit", description: "Edit nominations" },
  { permissionId: nanoid(), name: "nomination:note", description: "Add nomination notes" },
  // Chapter
  { permissionId: nanoid(), name: "chapter:create", description: "Create chapters" },
  { permissionId: nanoid(), name: "chapter:edit", description: "Edit chapters" },
  // University
  { permissionId: nanoid(), name: "university:create", description: "Submit universities" },
  { permissionId: nanoid(), name: "university:edit", description: "Edit universities" },
  { permissionId: nanoid(), name: "university:approve", description: "Approve universities" },
  // System
  { permissionId: nanoid(), name: "config:edit", description: "Edit config" },
  { permissionId: nanoid(), name: "auditlog:view", description: "View audit log" },
  // Order
  { permissionId: nanoid(), name: "order:view", description: "View orders" },
  { permissionId: nanoid(), name: "order:update", description: "Update orders" },
  // Account
  { permissionId: nanoid(), name: "account:delete", description: "Delete account" },
  { permissionId: nanoid(), name: "account:export", description: "Export account data" },
];

const ROLES = [
  { roleId: "role_user", name: "user", description: "Basic registered user" },
  { roleId: "role_member", name: "member", description: "Paid member" },
  { roleId: "role_committee", name: "committee", description: "Chapter committee member" },
  { roleId: "role_highcommittee", name: "highcommittee", description: "National committee member" },
  { roleId: "role_admin", name: "admin", description: "Platform administrator" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: [
    "campaign:view", "event:view", "media:view", "product:view",
    "nomination:view",
    "account:delete", "account:export",
  ],
  member: [
    "campaign:view", "event:view", "media:view", "product:view",
    "nomination:view",
    "account:delete", "account:export",
  ],
  committee: [
    "campaign:view", "campaign:create", "campaign:edit",
    "event:view", "event:create", "event:edit",
    "media:view", "media:create", "media:edit",
    "product:view", "product:create", "product:edit",
    "member:view",
    "nomination:view", "nomination:edit", "nomination:note",
    "account:delete", "account:export",
  ],
  highcommittee: [
    "campaign:view", "campaign:create", "campaign:edit", "campaign:delete",
    "event:view", "event:create", "event:edit", "event:delete",
    "media:view", "media:create", "media:edit", "media:delete",
    "product:view", "product:create", "product:edit", "product:delete", "product:approve",
    "member:view", "member:promote", "member:suspend",
    "role:create", "role:assign", "role:revoke",
    "nomination:view", "nomination:edit", "nomination:note",
    "chapter:create", "chapter:edit",
    "university:create", "university:edit", "university:approve",
    "order:view", "order:update",
    "account:delete", "account:export",
  ],
  admin: [
    "campaign:view", "campaign:create", "campaign:edit", "campaign:delete",
    "event:view", "event:create", "event:edit", "event:delete",
    "media:view", "media:create", "media:edit", "media:delete",
    "product:view", "product:create", "product:edit", "product:delete", "product:approve",
    "member:view", "member:promote", "member:suspend",
    "role:create", "role:assign", "role:revoke",
    "nomination:view", "nomination:edit", "nomination:note",
    "chapter:create", "chapter:edit",
    "university:create", "university:edit", "university:approve",
    "config:edit", "auditlog:view",
    "order:view", "order:update",
    "account:delete", "account:export",
  ],
};

const ACCOUNTS = [
  { name: "Admin User", email: "admin@liga.my", role: "role_admin", chapterSlug: "ligamy" },
  { name: "National User", email: "national@liga.my", role: "role_highcommittee", chapterSlug: "ligamy" },
  { name: "President User", email: "president@liga.my", role: "role_committee", chapterSlug: "ligaum" },
  { name: "Secretary User", email: "secretary@liga.my", role: "role_committee", chapterSlug: "ligaum" },
  { name: "Member User", email: "member@liga.my", role: "role_member", chapterSlug: "ligaum" },
  { name: "Expired User", email: "expired@liga.my", role: "role_member", chapterSlug: "ligautm" },
  { name: "Suspended User", email: "suspended@liga.my", role: "role_member", chapterSlug: "ligausm" },
  { name: "Basic User", email: "user@liga.my", role: "role_user", chapterSlug: "ligaunisza" },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const secret = body?.secret ?? request.headers.get("x-seed-secret");

  if (!SEED_SECRET || secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Chapters
    for (const ch of CHAPTERS) {
      await db.insert(chapter).values({
        chapterId: ch.chapterId,
        slug: ch.slug,
        name: ch.name,
        type: ch.type,
      }).onConflictDoNothing();
    }

    // 2. Permissions
    for (const perm of PERMISSIONS) {
      await db.insert(permission).values({
        permissionId: perm.permissionId,
        name: perm.name,
        description: perm.description,
      }).onConflictDoNothing();
    }

    // 3. Roles
    for (const r of ROLES) {
      await db.insert(role).values({
        roleId: r.roleId,
        name: r.name,
        description: r.description,
      }).onConflictDoNothing();
    }

    // 4. Role-Permission assignments
    for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
      const roleId = `role_${roleName}`;
      for (const permName of permNames) {
        const perm = PERMISSIONS.find((p) => p.name === permName);
        if (perm) {
          await db.insert(rolePermission).values({
            roleId,
            permissionId: perm.permissionId,
          }).onConflictDoNothing();
        }
      }
    }

    // 5. Config
    const now = new Date();
    await db.insert(config).values({ key: "member_fee", value: "10", updatedAt: now }).onConflictDoNothing();
    await db.insert(config).values({ key: "member_duration", value: "365", updatedAt: now }).onConflictDoNothing();
    await db.insert(config).values({ key: "site_name", value: "Liga Mahasiswa Malaysia", updatedAt: now }).onConflictDoNothing();

    // 6. Users
    const passwordHash = await hashPassword("password123");
    const results: { email: string; action: string }[] = [];

    for (const acct of ACCOUNTS) {
      const userId = `seed_${acct.email.split("@")[0]}`;
      const isMember = acct.role === "role_member" || acct.role === "role_committee" || acct.role === "role_highcommittee";
      const isExpired = acct.email === "expired@liga.my";
      const isSuspended = acct.email === "suspended@liga.my";

      // User
      await db.insert(user).values({
        userId,
        username: acct.email.split("@")[0],
        name: acct.name,
        email: acct.email,
        password: passwordHash,
        createdAt: now,
      }).onConflictDoNothing();

      // Role record
      await db.insert(roleRecord).values({
        recordId: nanoid(),
        userId,
        roleId: acct.role,
        startDate: now,
      }).onConflictDoNothing();

      // Member record (if applicable)
      if (isMember && !isExpired) {
        const memberId = `LMM-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
        await db.insert(member).values({
          memberId,
          userId,
          amountPaid: 10,
          paidAt: now,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }).onConflictDoNothing();
      }

      results.push({ email: acct.email, action: "created" });
    }

    return NextResponse.json({
      seeded: true,
      chapters: CHAPTERS.length,
      permissions: PERMISSIONS.length,
      roles: ROLES.length,
      accounts: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
