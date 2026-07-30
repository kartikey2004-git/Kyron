# Load tests (k6)

Three scripts, each with a different job:

| Script | Purpose | VUs | Target |
|---|---|---|---|
| `smoke.js` | Fast CI gate — must pass on every push | 1 | `/api/health`, `/` |
| `load.js` | Baseline latency under realistic concurrency | ramps 0→25 | `/`, `/login`, `/api/health` |
| `stress.js` | Find the breaking point of the one endpoint real external traffic actually hits | ramps 0→200 | `/api/webhooks/github` |

## Known scope limitation (read this before extending these scripts)

The original goal was to load-test the **authenticated dashboard** and a
**server action** (e.g. listing repositories). Neither is done here, on
purpose:

- There's no test/bypass auth in this app — real GitHub OAuth is required,
  and no such account exists in this environment.
- Next.js Server Actions aren't plain REST endpoints. They're invoked via a
  POST to the page URL carrying a `Next-Action` header whose value is a
  reference id generated per build — there's no way to construct a valid
  one without extracting it from a real authenticated browser session
  first, credentials or not.

If you have a real GitHub-connected account, you can extend `load.js`
yourself: log in via a browser, copy the `better-auth.session_token` cookie
value, and pass it as a `Cookie` header on requests to `/dashboard*`.

## Running

```bash
docker compose up -d                                        # full stack
docker compose --profile load-test run --rm k6 run -o experimental-prometheus-rw /scripts/smoke.js
docker compose --profile load-test run --rm k6 run -o experimental-prometheus-rw /scripts/load.js
docker compose --profile load-test run --rm k6 run -o experimental-prometheus-rw /scripts/stress.js
```

`-o experimental-prometheus-rw` is required — the `K6_PROMETHEUS_RW_SERVER_URL`
env var alone does not activate that output (a real gotcha hit while
building this: the first runs here silently produced zero data in
Prometheus because that flag was missing). Without `-o`, k6 still runs and
prints results to stdout, it just doesn't push anything anywhere.

Results land in Prometheus (`k6_*` metrics) and are visualized in Grafana's
**k6 Load Test** dashboard (`localhost:3001`) while a run is in progress —
metrics stop the moment the run ends, since k6 isn't a long-running
process.

## Recorded baseline (2026-07-28, docker-compose stack, one dev machine)

### First `load.js` run: caught a real bug, not a performance number

The very first run reported a suspicious **exactly 33.33%** failure rate.
Not "high load degraded 1/3 of requests" — every single `/login` request
failed, every time, regardless of load. `docker compose logs app` showed
why: `.env.docker` still had the empty placeholder
`BETTER_AUTH_SECRET=` from `.env.docker.example`, and Better Auth hard-fails
`getSession()` with `BetterAuthError: You are using the default secret`
rather than silently running insecurely. Fixed by generating a real secret
(`openssl rand -base64 32`) into `.env.docker` and restarting the app. This
is exactly the kind of thing an actual load test run is supposed to surface
— worth keeping in this doc rather than quietly rerunning until it looked
clean.

### `smoke.js` — cold vs. warm container

| | p95 | max |
|---|---|---|
| First request against a container that had *just* become `(healthy)` | 3.65s | 6.38s |
| Same script, same container, ~2 minutes later | 197ms | 271ms |

Cold-start latency on the very first hit(s) against a freshly-started
standalone Next.js process, not a systemic problem — confirmed by rerunning
immediately after. `smoke.js`'s checked-in threshold (`p(95)<2000`) leaves
real margin for this rather than being tuned to the warm number and flaking
on deploy day.

### `load.js` — clean run, real secret, 3714 requests over 3m30s

```
http_req_duration: avg=517.22ms min=2.33ms med=141.72ms max=15.26s p(90)=1.09s p(95)=1.95s
http_req_failed:   0.00% (0 out of 3714)
```

p99 (from k6's fuller summary): **7.70s**. Median request (142ms) is fast;
the tail is long. This is a single Next.js container, single Postgres
instance, no connection pooling tuning beyond Prisma's defaults, on one
dev machine under Docker Desktop — not a claim about how this would behave
on real infrastructure. `load.js`'s checked-in thresholds
(`p(95)<2500`, `p(99)<9000`) add headroom over this measured baseline so
the test catches a *regression*, not this exact run.

These are the numbers `docs/slo.md` (next phase) derives its latency SLO
from — not invented targets.

### `stress.js` — webhook ingestion, ramped to 200 VUs

```
http_reqs:        38382 (182.7 req/s)
http_req_failed:  0.00%
http_req_duration: avg=271ms p(90)=585ms p(95)=1.00s max=12.29s
```

**Didn't find the breaking point.** `/api/webhooks/github` held up cleanly
through 200 concurrent VUs with zero failures. That's a real result, not a
gap — it means this endpoint's actual ceiling is higher than what this
script/machine combination could generate, not that it's provably
unbreakable. If you want to actually find the ceiling, raise the `target`
values in `stress.js`'s `stages`.
