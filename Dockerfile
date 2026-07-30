# syntax=docker/dockerfile:1

# ---- deps: install dependencies (cached separately from source changes) ----
FROM oven/bun:1.2.21-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

# ---- builder: generate Prisma client + build the standalone Next.js server ----
FROM oven/bun:1.2.21-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time-only placeholders. `next build` traces/imports lib/auth.ts and
# lib/db.ts at compile time even though nothing is queried; NEXT_PUBLIC_*
# vars ARE baked into the client bundle, so override NEXT_PUBLIC_APP_BASE_URL
# via `--build-arg` (or docker-compose `build.args`) if it differs from the
# local-stack default below. None of these values are used at runtime — the
# runner stage below gets real secrets from the container's environment.
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=disable"
ARG BETTER_AUTH_SECRET="build-time-placeholder"
ARG BETTER_AUTH_URL="http://localhost:3000"
ARG GITHUB_CLIENT_ID="build-time-placeholder"
ARG GITHUB_CLIENT_SECRET="build-time-placeholder"
ARG GOOGLE_GENERATIVE_AI_API_KEY="build-time-placeholder"
ARG NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000"
ENV DATABASE_URL=$DATABASE_URL \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    BETTER_AUTH_URL=$BETTER_AUTH_URL \
    GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
    GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
    GOOGLE_GENERATIVE_AI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY \
    NEXT_PUBLIC_APP_BASE_URL=$NEXT_PUBLIC_APP_BASE_URL

RUN bun run build

# ---- runner: minimal production image ----
FROM oven/bun:1.2.21-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Next.js standalone output traces the JS import graph only. lib/tree-sitter.ts
# reads *.wasm grammars off disk at runtime (not via import), so they must be
# copied explicitly or AST chunking silently falls back / warns at runtime.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/lib/wasm ./lib/wasm

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
    CMD bun -e "fetch('http://localhost:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "server.js"]
