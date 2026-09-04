import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("hashPassword / verifyPassword", () => {
  it("hashes a password into a non-plaintext string", async () => {
    const hashed = await hashPassword("s3cr3t-pass");
    expect(hashed).not.toBe("s3cr3t-pass");
    expect(hashed).toContain("$2");
  });

  it("produces different hashes for the same input (salt)", async () => {
    const h1 = await hashPassword("same-pass");
    const h2 = await hashPassword("same-pass");
    expect(h1).not.toBe(h2);
  });

  it("verifies the correct password", async () => {
    const hashed = await hashPassword("correct-horse");
    expect(await verifyPassword("correct-horse", hashed)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hashed = await hashPassword("correct-horse");
    expect(await verifyPassword("wrong-horse", hashed)).toBe(false);
  });

  it("rejects empty-password attempts against a real hash", async () => {
    const hashed = await hashPassword("cool-pass");
    expect(await verifyPassword("", hashed)).toBe(false);
  });
});
