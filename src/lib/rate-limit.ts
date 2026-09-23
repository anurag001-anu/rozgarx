import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if env vars are present to avoid breaking local dev if they aren't setup yet.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (redisUrl && redisToken) 
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// IP Based for public APIs (Search, Similar)
export const ipRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"), // 20 requests per 10 seconds per IP
  analytics: true,
}) : null;

// User ID Based for authenticated APIs (Recommended)
export const userRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests per 10 seconds per User
  analytics: true,
}) : null;
