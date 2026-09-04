import { describe, it, expect, vi, beforeEach } from "vitest";

const ratelimitMock = vi.hoisted(() => ({
  slidingWindow: vi.fn(() => ({})),
  instance: {
    limit: vi.fn(),
  },
  ratelimitCtor: vi.fn(),
}));

vi.mock("@upstash/ratelimit", () => {
  const ctor = function () {
    return ratelimitMock.instance;
  };
  ctor.slidingWindow = ratelimitMock.slidingWindow;
  return { Ratelimit: ctor };
});

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: vi.fn(() => ({})) },
}));

import { checkRateLimit } from "@/lib/rate-limit";
import { Redis } from "@upstash/redis";

async function loadFresh() {
  vi.resetModules();
  return await import("@/lib/rate-limit");
}

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe("checkRateLimit", () => {
  it("allows the request when Upstash env is not configured", async () => {
    const mod = await loadFresh();
    const result = await mod.checkRateLimit("ip:1.2.3.4");
    expect(result).toEqual({ success: true, remaining: 999 });
  });

  it("returns the Upstash result when configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token-123";

    ratelimitMock.instance.limit.mockResolvedValue({ success: false, remaining: 0 });

    const mod = await loadFresh();
    const result = await mod.checkRateLimit("ip:5.6.7.8", 5, "30 s");

    expect(Redis.fromEnv).toHaveBeenCalled();
    expect(ratelimitMock.slidingWindow).toHaveBeenCalledWith(5, "30 s");
    expect(ratelimitMock.instance.limit).toHaveBeenCalledWith("ip:5.6.7.8");
    expect(result).toEqual({ success: false, remaining: 0 });
  });
});
