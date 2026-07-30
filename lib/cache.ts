import { createHash } from "node:crypto";
import redis from "@/lib/redis";
import { getLogger } from "@/lib/logger";
import { cacheHits, cacheMisses } from "@/lib/metrics";

// JSON.stringify/parse can't round-trip BigInt (throws) or Date (silently
// degrades to a string) — both show up in Prisma results cached here
// (Repository.githubId is BigInt, most models have Date timestamps). The
// replacer's `this[key]` trick reads the field before Date's own toJSON
// runs, so both get tagged and restored correctly.
function serialize(value: unknown): string {
  return JSON.stringify(value, function (key, val) {
    const raw = (this as Record<string, unknown>)[key];
    if (typeof raw === "bigint") return { __type: "bigint", value: raw.toString() };
    if (raw instanceof Date) return { __type: "date", value: raw.toISOString() };
    return val;
  });
}

function deserialize<T>(raw: string): T {
  return JSON.parse(raw, (_key, val) => {
    if (val && typeof val === "object") {
      if (val.__type === "bigint") return BigInt(val.value);
      if (val.__type === "date") return new Date(val.value);
    }
    return val;
  });
}

// Deterministic short key fragment for values that shouldn't appear
// verbatim in a Redis key (access tokens) or that are the cache key
// themselves (content-addressed embeddings).
export function hashKey(...parts: string[]): string {
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 16);
}

// Cache-aside with graceful degradation: any Redis failure (down, timeout,
// connection refused) falls through to calling fn() directly rather than
// throwing — a cache outage must degrade the app to "uncached", never take
// it down. This is exercised by the Phase 9 chaos test that kills Redis
// mid-load-test.
export async function getOrSet<T>(
  key: string,
  ttlSeconds: number | null,
  fn: () => Promise<T>
): Promise<T> {
  const logger = getLogger({ cacheKey: key });

  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      cacheHits.labels({ cache_name: cacheName(key) }).inc();
      return deserialize<T>(cached);
    }
  } catch (error) {
    logger.warn(
      { err: error instanceof Error ? error.message : String(error) },
      "cache read failed, falling through to source"
    );
  }

  cacheMisses.labels({ cache_name: cacheName(key) }).inc();
  const value = await fn();

  try {
    const payload = serialize(value);
    if (ttlSeconds === null) {
      await redis.set(key, payload);
    } else {
      await redis.set(key, payload, "EX", ttlSeconds);
    }
  } catch (error) {
    logger.warn(
      { err: error instanceof Error ? error.message : String(error) },
      "cache write failed, continuing without caching this value"
    );
  }

  return value;
}

export async function invalidatePattern(pattern: string): Promise<void> {
  const logger = getLogger({ cachePattern: pattern });

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.warn(
      { err: error instanceof Error ? error.message : String(error) },
      "cache invalidation failed"
    );
  }
}

export async function del(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    getLogger({ cacheKey: key }).warn(
      { err: error instanceof Error ? error.message : String(error) },
      "cache delete failed"
    );
  }
}

// First colon-delimited segment of a key (e.g. "dash", "github", "embedding")
// — the bounded label value for cache_hits_total/cache_misses_total.
function cacheName(key: string): string {
  return key.split(":")[0];
}
