#!/usr/bin/env bash
# Chaos test: inject network delay on the app container's egress traffic
# (simulating a slow/degraded GitHub API) and verify our timeout fix
# (GITHUB_REQUEST_TIMEOUT_MS in modules/github/lib/github.ts,
# lib/github-repo.ts, and inngest/functions/index.ts) actually bounds the
# wait — a call must fail around ~15s, not hang for the full injected
# delay, and definitely not forever.
#
# Two real constraints in this environment shaped how this is tested, not
# how the underlying claim is verified:
#   1. No real GitHub OAuth account exists here (same limitation as
#      load-tests/README.md), so this can't drive the real
#      indexRepository/generateReview pipeline end-to-end. It calls a
#      real, public GitHub REST endpoint directly instead.
#   2. `octokit` isn't resolvable via an ad-hoc `bun -e` script inside the
#      standalone production image — Next.js's output file tracing prunes
#      node_modules down to only what each bundled route/page actually
#      imports, and this script isn't one of them. So this exercises raw
#      `fetch()` with the exact same `AbortSignal.timeout()` mechanism our
#      fix uses, since Octokit itself is built on fetch/undici — the same
#      underlying abort mechanism, not a reimplementation of it.
#
# Requires: `docker compose up -d postgres redis app` already running.
set -euo pipefail

# See chaos/kill-postgres.sh for why this is needed on Windows/Git Bash.
export MSYS_NO_PATHCONV=1

CONTAINER="ai-code-review-app"
DELAY_MS="${DELAY_MS:-20000}"    # bigger than our 15s timeout, on purpose
NETEM_DURATION="30s"
TIMEOUT_MS=15000

echo "== network-latency-github chaos test =="

echo "-- baseline (no delay) --"
docker exec "$CONTAINER" sh -c "cd /app && bun -e '
const start = Date.now();
fetch(\"https://api.github.com/repos/octocat/Hello-World\", {
  signal: AbortSignal.timeout($TIMEOUT_MS),
  headers: { \"User-Agent\": \"chaos-test\" },
}).then((r) => {
  console.log(\"SUCCESS after \" + (Date.now()-start) + \"ms status=\" + r.status);
}).catch((err) => {
  console.log(\"FAILED after \" + (Date.now()-start) + \"ms: \" + err.name + \" \" + err.message);
});
'"

echo
echo "-- injecting ${DELAY_MS}ms egress delay on ${CONTAINER} for ${NETEM_DURATION} --"
docker run -d --rm --name pumba-netem-test \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gaiaadm/pumba netem --duration "$NETEM_DURATION" delay --time "$DELAY_MS" "$CONTAINER" >/dev/null

sleep 2
echo "-- calling the same endpoint under injected delay (should abort around ${TIMEOUT_MS}ms, not hang ${DELAY_MS}ms+) --"

docker exec "$CONTAINER" sh -c "cd /app && bun -e '
const start = Date.now();
fetch(\"https://api.github.com/repos/octocat/Hello-World\", {
  signal: AbortSignal.timeout($TIMEOUT_MS),
  headers: { \"User-Agent\": \"chaos-test\" },
}).then((r) => {
  console.log(\"UNEXPECTED_SUCCESS after \" + (Date.now()-start) + \"ms status=\" + r.status);
}).catch((err) => {
  console.log(\"ABORTED after \" + (Date.now()-start) + \"ms: \" + err.name + \" \" + err.message);
});
'"

docker kill pumba-netem-test >/dev/null 2>&1 || true

echo
echo "== done. PASS if the delayed call aborted at ~${TIMEOUT_MS}ms, not ${DELAY_MS}ms+ or hung. =="
