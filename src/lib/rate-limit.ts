import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const cache = new Map<string, Ratelimit>();

function getRatelimit(limit: number, window: Duration): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const cacheKey = `${limit}|${window}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const rl = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
  });

  cache.set(cacheKey, rl);
  return rl;
}

export async function checkRateLimit(
  key: string,
  limit: number = 10,
  window: Duration = "60 s"
): Promise<{ success: boolean; remaining: number }> {
  const rl = getRatelimit(limit, window);
  if (!rl) return { success: true, remaining: 999 };

  const result = await rl.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
  };
}
