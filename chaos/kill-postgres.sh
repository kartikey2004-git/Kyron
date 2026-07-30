#!/usr/bin/env bash
# Chaos test: SIGKILL the postgres container mid-traffic.
#
# Expected (Postgres has no fallback — lib/db.ts, unlike lib/cache.ts, has
# nothing to degrade to): /api/health flips to 503 while Postgres is down
# (never hangs), then recovers to 200 on its own once Docker's
# `restart: unless-stopped` policy brings the container back — no restart
# of the app container required.
#
# Requires: `docker compose up -d postgres redis app` already running.
# Uses Pumba (https://github.com/alexei-led/pumba) via its Docker image —
# no local install needed, it talks to the Docker socket directly.
set -euo pipefail

# Git Bash on Windows rewrites leading-/ arguments (like the docker socket
# path below) into Windows paths before they reach `docker run`, breaking
# the mount. No effect on Linux/Mac. See load-tests/README.md for the same
# gotcha hit with k6.
export MSYS_NO_PATHCONV=1

BASE_URL="${BASE_URL:-http://localhost:3000}"
CONTAINER="ai-code-review-db"
DURATION_S=45
KILL_AT_S=10

echo "== kill-postgres chaos test =="
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

for i in $(seq 1 "$DURATION_S"); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$BASE_URL/api/health" 2>/dev/null || echo "000")
  if [ "$STATUS" = "000" ]; then
    echo "t=${i}s status=TIMEOUT/no-response"
  else
    echo "t=${i}s status=${STATUS}"
  fi
  sleep 1
done

wait "$KILLER_PID" 2>/dev/null || true

echo
echo "== done. Check above for: 200s -> 503s (never a hang) -> 200s again. =="
