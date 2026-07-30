import client from "prom-client";

// Guardrail: never label a metric with a raw URL, repo name, or PR number —
// only bounded values (route templates, fixed endpoint names, status
// codes). Unbounded label values blow up Prometheus's memory/cardinality.

function build() {
  const registry = new client.Registry();
  client.collectDefaultMetrics({ register: registry });

  const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of inbound HTTP requests in seconds",
    labelNames: ["route", "method", "status_code"] as const,
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [registry],
  });

  const reviewGenerationDuration = new client.Histogram({
    name: "review_generation_duration_seconds",
    help: "Duration of a full generateReview Inngest run, from event received to PR comment posted",
    buckets: [1, 2.5, 5, 10, 20, 30, 60, 120, 180, 300],
    registers: [registry],
  });

  const repositoryIndexDuration = new client.Histogram({
    name: "repository_index_duration_seconds",
    help: "Duration of a full indexRepository Inngest run",
    buckets: [1, 5, 10, 30, 60, 120, 300, 600, 1200],
    registers: [registry],
  });

  const embeddingGenerationDuration = new client.Histogram({
    name: "embedding_generation_duration_seconds",
    help: "Duration of a single successful Gemini embedContent call",
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    registers: [registry],
  });

  const embeddingBatchSize = new client.Histogram({
    name: "embedding_batch_size",
    help: "Number of code chunks embedded per batch during repository indexing",
    buckets: [1, 5, 10, 15, 20, 30, 50],
    registers: [registry],
  });

  const githubApiCallDuration = new client.Histogram({
    name: "github_api_call_duration_seconds",
    help: "Duration of outbound GitHub API calls",
    labelNames: ["endpoint"] as const,
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
    registers: [registry],
  });

  const githubApiErrors = new client.Counter({
    name: "github_api_errors_total",
    help: "Count of failed outbound GitHub API calls",
    labelNames: ["endpoint", "status_code"] as const,
    registers: [registry],
  });

  const cacheHits = new client.Counter({
    name: "cache_hits_total",
    help: "Count of cache-aside reads served from Redis",
    labelNames: ["cache_name"] as const,
    registers: [registry],
  });

  const cacheMisses = new client.Counter({
    name: "cache_misses_total",
    help: "Count of cache-aside reads that fell through to the source of truth",
    labelNames: ["cache_name"] as const,
    registers: [registry],
  });

  return {
    registry,
    httpRequestDuration,
    reviewGenerationDuration,
    repositoryIndexDuration,
    embeddingGenerationDuration,
    embeddingBatchSize,
    githubApiCallDuration,
    githubApiErrors,
    cacheHits,
    cacheMisses,
  };
}

type Metrics = ReturnType<typeof build>;

declare global {
  var __metrics: Metrics | undefined;
}

// globalThis, not a module-level singleton, and unconditionally (not just
// in dev): Next.js bundles Route Handlers and Page/Layout Server
// Components into SEPARATE chunks, each getting its own module
// instantiation of this file at runtime — a plain `const registry = new
// Registry()` at module scope is NOT actually shared between e.g.
// app/api/metrics/route.ts and app/dashboard/layout.tsx in production,
// even though they're the same process. globalThis is a true
// process-wide object and is the only thing both bundles actually share.
// (Also survives dev hot-reload, which is the part that's easy to assume
// is the only reason this pattern exists — it isn't, here.)
const metrics = globalThis.__metrics ?? build();
globalThis.__metrics = metrics;

export const {
  registry,
  httpRequestDuration,
  reviewGenerationDuration,
  repositoryIndexDuration,
  embeddingGenerationDuration,
  embeddingBatchSize,
  githubApiCallDuration,
  githubApiErrors,
  cacheHits,
  cacheMisses,
} = metrics;
