/**
 * serverCache — shared caching layer for platform data proxy routes.
 *
 * Two-tier design:
 *  - Tier 1: Upstash Redis (enabled when UPSTASH_REDIS_REST_URL /
 *    UPSTASH_REDIS_REST_TOKEN are present in the environment).
 *  - Tier 2: in-memory LRU fallback kept in warm Vercel Function container
 *    state, which covers bursts until Redis is configured.
 *
 * A cold cache never surfaces as an error: callers simply re-fetch from the
 * upstream platform, so this module is deliberately side-effect-free on miss.
 */
export interface CachedValue<T> {
  value: T;
  cachedAt: number; // epoch ms
  ttlMs: number;
}

interface RedisLike {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<unknown>;
}

/**
 * Tiny FIFO LRU fallback used when Redis is not configured.
 * Kept in module scope so Vercel's warm container state serves repeated hits.
 */
class MemoryLRU<T> {
  private store = new Map<string, CachedValue<T>>();
  constructor(private max = 512) {}
  get(key: string): CachedValue<T> | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > entry.ttlMs) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }
  set(key: string, entry: CachedValue<T>) {
    if (this.store.size >= this.max) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) this.store.delete(oldestKey);
    }
    this.store.set(key, entry);
  }
}

const memory = new MemoryLRU<unknown>();
let redisInstance: RedisLike | null = null;

async function redisStore(): Promise<RedisLike | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (redisInstance) return redisInstance;
  try {
    const { Redis } = await import("@upstash/redis");
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }) as unknown as RedisLike;
    return redisInstance;
  } catch {
    return null;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = await redisStore();
  if (redis) {
    const entry = await redis.get<CachedValue<T>>(key);
    if (entry && Date.now() - entry.cachedAt <= entry.ttlMs) return entry.value;
    return null;
  }
  return (memory.get(key) as CachedValue<T> | null)?.value ?? null;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlMs: number,
): Promise<void> {
  const entry: CachedValue<T> = { value, cachedAt: Date.now(), ttlMs };
  const redis = await redisStore();
  if (redis) {
    await redis.set(key, entry, { ex: Math.ceil(ttlMs / 1000) });
    return;
  }
  memory.set(key, entry);
}

/**
 * Versioned cache key scoped to a platform so future schemas never collide.
 */
export function cacheKey(platform: string, username: string): string {
  return `devmetrics:v1:${platform}:${username.trim().toLowerCase()}`;
}

/**
 * Per-platform TTLs tuned to upstream data velocity.
 * Developer metrics are inherently slow-moving; 10-15 minute freshness is
 * indistinguishable to users while collapsing repeated upstream calls.
 */
export const TTL = {
  github: 15 * 60 * 1000, // 15 min - profile/repos move slowly
} as const;
