import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
  });

  return ratelimit;
}

export async function checkRateLimit(
  key: string,
  limit: number = 10,
  window: string = "60 s"
): Promise<{ success: boolean; remaining: number }> {
  const rl = getRatelimit();
  if (!rl) return { success: true, remaining: 999 };

  const result = await rl.limit(key);
  return {
    success: result.success,
    remaining: result.remaining,
  };
}
