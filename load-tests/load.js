// Ramping-VU load test against the app's actual PUBLIC surface.
//
// Deviation from the original plan worth stating explicitly: the plan
// called for hitting "authenticated dashboard pages and a representative
// server action (list repositories)". Neither is reachable here without a
// real GitHub OAuth account (no test/bypass auth exists in this app), and
// Next.js Server Actions aren't plain REST endpoints — they require a
// `Next-Action` reference id generated per-build, so they can't be called
// from k6 without first extracting that id from a live authenticated
// browser session anyway. So this script measures what's genuinely
// reachable: the landing page, the login page, and the health check. If
// you have real credentials, extract a session cookie from your browser
// and add it as a `Cookie` header below to extend this to /dashboard.
//
// Thresholds below are NOT invented — they come from an actual k6 run
// against the full docker-compose stack on 2026-07-28 (see
// load-tests/README.md for the raw output, including a first run that
// caught a real bug, and how to reproduce this). Measured clean baseline:
// p90=1.09s, p95=1.95s, p99=7.70s, 0% failures across 3714 requests. The
// thresholds below add headroom over that baseline — they're meant to
// catch a real regression, not to encode this exact run as gospel (see
// README for why single-machine tail latency runs this high).
import http from "k6/http";
import { check, group, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "30s", target: 25 },
    { duration: "1m", target: 25 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2500", "p(99)<9000"],
  },
};

export default function () {
  group("landing page", () => {
    const res = http.get(`${BASE_URL}/`);
    check(res, { "status is 200": (r) => r.status === 200 });
  });

  group("login page", () => {
    const res = http.get(`${BASE_URL}/login`);
    check(res, { "status is 200": (r) => r.status === 200 });
  });

  group("health check", () => {
    const res = http.get(`${BASE_URL}/api/health`);
    check(res, { "status is 200": (r) => r.status === 200 });
  });

  sleep(1);
}
