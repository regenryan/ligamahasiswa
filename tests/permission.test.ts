import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMock = vi.hoisted(() => ({
  select: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ db: dbMock }));

import {
  getUserRoles,
  getUserPermissions,
  hasRole,
  hasMinimumRole,
  checkRoleHierarchy,
} from "@/lib/permission";

// Build a promise-chain: .from()/.innerJoin()/.where() all resolve to the given rows,
// and the chain is thenable so `await db.select().from(...)` works.
function fakeSelect(rows: unknown[]) {
  const chain = Promise.resolve(rows) as Promise<unknown[]> & {
    from: ReturnType<typeof vi.fn>;
    innerJoin: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
  };
  chain.innerJoin = vi.fn(() => chain);
  chain.where = vi.fn(() => chain);
  return {
    from: vi.fn(() => chain),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUserRoles", () => {
  it("returns role names for a user", async () => {
    dbMock.select.mockReturnValue(
      fakeSelect([{ roleName: "member" }, { roleName: "committee" }]),
    );
    const roles = await getUserRoles("u1");
    expect(roles).toEqual(["member", "committee"]);
  });

  it("returns an empty array for a user with no roles", async () => {
    dbMock.select.mockReturnValue(fakeSelect([]));
    expect(await getUserRoles("u-none")).toEqual([]);
  });
});

describe("getUserPermissions", () => {
  it("returns an empty list when the user has no roles without hitting perms", async () => {
    dbMock.select.mockReturnValue(fakeSelect([])); // getUserRoles -> []
    expect(await getUserPermissions("u-none")).toEqual([]);
    // admin path not taken; no further select call
    // (getUserRoles used the only select; if it returned early, no second call)
  });

  it("grants all permissions to admins", async () => {
    dbMock.select
      .mockReturnValueOnce(fakeSelect([{ roleName: "admin" }])) // getUserRoles
      .mockReturnValueOnce(fakeSelect([{ name: "content.edit" }, { name: "users.manage" }])); // all perms

    const perms = await getUserPermissions("u-admin");
    expect(perms).toEqual(["content.edit", "users.manage"]);
    expect(dbMock.select).toHaveBeenCalledTimes(2);
  });

  it("inherits lower roles and filters matching permission rows", async () => {
    dbMock.select
      .mockReturnValueOnce(fakeSelect([{ roleName: "committee" }])) // getUserRoles
      .mockReturnValueOnce(
        fakeSelect([
          { roleName: "user", permName: "site.read" },
          { roleName: "member", permName: "events.rsvp" },
          { roleName: "committee", permName: "content.edit" },
          { roleName: "admin", permName: "users.manage" }, // admin > committee, filtered out
        ]),
      );

    const perms = await getUserPermissions("u-committee");
    // committee inherits user(0), member(1), committee(2) but not admin(4)
    expect(perms).toEqual(["site.read", "events.rsvp", "content.edit"]);
  });
});

describe("hasRole / hasMinimumRole", () => {
  it("hasRole returns true only when the exact role is present", async () => {
    dbMock.select.mockReturnValue(fakeSelect([{ roleName: "member" }]));
    expect(await hasRole("u1", "member")).toBe(true);
    expect(await hasRole("u1", "admin")).toBe(false);
  });

  it("hasMinimumRole checks the hierarchy level", async () => {
    dbMock.select.mockReturnValue(fakeSelect([{ roleName: "committee" }]));
    expect(await hasMinimumRole("u1", "member")).toBe(true); // committee(2) >= member(1)
    expect(await hasMinimumRole("u1", "highcommittee")).toBe(false); // 2 < 3
  });
});

describe("checkRoleHierarchy", () => {
  it("allows a higher role to act on a lower role", () => {
    expect(checkRoleHierarchy("admin", "committee")).toBe(true);
    expect(checkRoleHierarchy("member", "user")).toBe(true);
  });

  it("blocks equal or lower roles from acting up", () => {
    expect(checkRoleHierarchy("member", "member")).toBe(false);
    expect(checkRoleHierarchy("user", "member")).toBe(false);
    expect(checkRoleHierarchy("committee", "highcommittee")).toBe(false);
  });

  it("treats unknown roles as level 0", () => {
    expect(checkRoleHierarchy("anything", "user")).toBe(false);
    expect(checkRoleHierarchy("user", "unknown")).toBe(false);
  });
});
