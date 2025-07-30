import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
let cache = null;
let videoCache = null;
let summarizeCache = null;

export function getRatelimitCache(type = 0) {
  if (type === 1) {
    if (!videoCache) {
      videoCache = new Map();
    }
    return videoCache;
  }
  if (type === 2) {
    if (!summarizeCache) {
      summarizeCache = new Map();
    }
    return summarizeCache;
  }
  if (!cache) {
    cache = new Map();
  }
  return cache;
}

const ratelimitMessages = () =>
  new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(500, "30 d"),
    prefix: "ratelimit:messages",
    analytics: true,
    ephemeralCache: new Map(),
  });

export { ratelimitMessages };
