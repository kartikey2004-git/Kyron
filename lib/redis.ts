import Redis from "ioredis";

declare global {
  var __redis: Redis | undefined;
}

function build(): Redis {
  const client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    // Cap retries so a dead Redis fails fast instead of building up an
    // unbounded queue of commands — lib/cache.ts falls back to calling
    // through to the source of truth on any of these failures.
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: false,
  });

  client.on("error", (err) => {
    // Deliberately not using lib/logger.ts here: this fires before request
    // context exists (e.g. at boot) and logging every dropped connection
    // attempt would be noisy — lib/cache.ts logs at the call-site instead,
    // once per cache operation that actually failed.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[redis] connection error:", err.message);
    }
  });

  return client;
}

// globalThis, unconditionally, in production too — see lib/metrics.ts for
// why this isn't just a dev-hot-reload concern: without it, every
// separately-bundled Route Handler / Page / Layout chunk would open its
// own independent Redis connection instead of sharing one.
const redis = globalThis.__redis ?? build();
globalThis.__redis = redis;

export default redis;
