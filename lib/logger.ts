import pino from "pino";
import { trace } from "@opentelemetry/api";
import { getRequestContext } from "./request-context";

// JSON to stdout — a container's log driver (or Promtail, later) ships
// this to the log backend. No transport/file target here on purpose: it
// must behave the same whether running under `bun run dev`, in the Docker
// container, or (in principle) on Vercel.
const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    service: "ai-code-review",
    env: process.env.NODE_ENV ?? "development",
  },
  redact: {
    paths: [
      "accessToken",
      "*.accessToken",
      "token",
      "*.token",
      "authorization",
      "*.authorization",
      "cookie",
      "*.cookie",
      "apiKey",
      "*.apiKey",
    ],
    censor: "[REDACTED]",
  },
});

// Returns a child logger bound to the current request's requestId/userId
// (set via withRequestContext) and, if called inside an active OTel span
// (see lib/tracing.ts), that span's traceId/spanId — this is what lets a
// slow span in Tempo be clicked through to its exact log lines in Grafana.
// Call sites never need to thread any of this through function signatures.
export function getLogger(bindings: Record<string, unknown> = {}) {
  const ctx = getRequestContext();
  const spanContext = trace.getActiveSpan()?.spanContext();

  return baseLogger.child({
    ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
    ...(ctx?.userId ? { userId: ctx.userId } : {}),
    ...(spanContext
      ? { traceId: spanContext.traceId, spanId: spanContext.spanId }
      : {}),
    ...bindings,
  });
}
