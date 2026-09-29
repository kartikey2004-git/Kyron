#!/usr/bin/env bash
# Chaos test: SIGKILL the redis container mid-traffic.
#
# Expected (Redis DOES have a fallback — lib/cache.ts's getOrSet() catches
# any Redis failure and calls through to the source of truth, see
# docs/caching-strategy.md): /api/health should stay 200 the entire time,
# with `checks.redis` flipping error -> ok as Redis goes down and recovers
# — the OPPOSITE of kill-postgres.sh's expected 503, on purpose, because
# these two dependencies have fundamentally different failure contracts.
#
# Requires: `docker compose up -d postgres redis app` already running.
set -euo pipefail

# See chaos/kill-postgres.sh for why this is needed on Windows/Git Bash.
export MSYS_NO_PATHCONV=1

BASE_URL="${BASE_URL:-http://localhost:3000}"
CONTAINER="kyron-redis"
DURATION_S=45
KILL_AT_S=10

echo "== kill-redis chaos test =="
echo "Polling ${BASE_URL}/api/health every 1s for ${DURATION_S}s."
echo "Killing ${CONTAINER} (SIGKILL) at t=${KILL_AT_S}s."
echo

(
  sleep "$KILL_AT_S"
  echo ">>> t=${KILL_AT_S}s: pumba kill --signal SIGKILL ${CONTAINER}"
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    gaiaadm/pumba kill --signal SIGKILL "$CONTAINER"
) &
KILLER_PID=$!

FAILURES=0
for i in $(seq 1 "$DURATION_S"); do
  BODY=$(curl -s --max-time 3 "$BASE_URL/api/health" 2>/dev/null || echo '{"status":"TIMEOUT"}')
  STATUS_FIELD=$(echo "$BODY" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);console.log(j.status+' redis='+j.checks.redis)}catch{console.log('PARSE_ERROR')}})" 2>/dev/null || echo "ERROR")
  echo "t=${i}s ${STATUS_FIELD}"
  if [ "$STATUS_FIELD" != "${STATUS_FIELD#TIMEOUT}" ] || [ "$STATUS_FIELD" = "PARSE_ERROR" ]; then
    FAILURES=$((FAILURES + 1))
  fi
  sleep 1
done

wait "$KILLER_PID" 2>/dev/null || true

echo
echo "== done. ${FAILURES} non-responsive ticks out of ${DURATION_S}. =="
echo "== Expected: status=ok the entire time; checks.redis flips ok -> error -> ok. =="
