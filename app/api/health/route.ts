import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import redis from "@/lib/redis";

// Used by the Dockerfile HEALTHCHECK, docker-compose `depends_on:
// condition: service_healthy`, and the CI/CD smoke test / rollback gate.
// Keep dependency checks here in sync with what the container actually
// needs to serve traffic.
//
// Postgres has no fallback, so it gates overall health. Redis does have a
// fallback (lib/cache.ts calls through to the source of truth on any
// failure — see docs/caching-strategy.md), so a down Redis is reported but
// doesn't fail the health check: the app is genuinely still serviceable,
// just slower/heavier-loaded, and failing health here would make Docker
// restart a perfectly capable container.
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};
  let healthy = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
    healthy = false;
  }

  try {
    await redis.ping();
    checks.redis = "ok";
  } catch {
    checks.redis = "error";
  }

  return NextResponse.json(
    { status: healthy ? "ok" : "error", checks },
    { status: healthy ? 200 : 503 }
  );
}
