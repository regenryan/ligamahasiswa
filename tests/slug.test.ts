import { describe, it, expect } from "vitest";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("lowercases and trims", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("replaces spaces and underscores with hyphens", () => {
    expect(generateSlug("a b_c d")).toBe("a-b-c-d");
  });

  it("strips special characters", () => {
    expect(generateSlug("Mansuh AUKU! #55")).toBe("mansuh-auku-55");
    expect(generateSlug("café & rest")).toBe("caf-rest");
  });

  it("collapses repeated hyphens", () => {
    expect(generateSlug("a---b")).toBe("a-b");
    expect(generateSlug("a -- b")).toBe("a-b");
  });

  it("removes leading and trailing hyphens", () => {
    expect(generateSlug("--hello--")).toBe("hello");
  });

  it("handles empty and symbol-only input", () => {
    expect(generateSlug("")).toBe("");
    expect(generateSlug("!@#$%")).toBe("");
  });

  it("preserves digits and multibyte vowel proceeds", () => {
    expect(generateSlug("PRK 2026")).toBe("prk-2026");
  });
});

describe("generateUniqueSlug", () => {
  it("returns the base slug when free", () => {
    expect(generateUniqueSlug("hello", [])).toBe("hello");
    expect(generateUniqueSlug("hello", ["other"])).toBe("hello");
  });

  it("appends -2 when slug exists", () => {
    expect(generateUniqueSlug("hello", ["hello"])).toBe("hello-2");
  });

  it("increments the counter past existing suffixed slugs", () => {
    expect(generateUniqueSlug("hello", ["hello", "hello-2", "hello-3"])).toBe("hello-4");
  });

  it("compacts the base before uniqueness logic", () => {
    expect(generateUniqueSlug("  Hello World ", ["hello-world"])).toBe("hello-world-2");
  });
});
