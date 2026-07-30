// Fast gate: 1 VU, a handful of iterations, hits the two routes that must
// never be broken by a deploy. This is what CI runs on every push (see
// .github/workflows/ci-cd.yml) — it should finish in seconds, not minutes.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ["rate==0"],
    // 2000ms not 1000ms: measured against a container that had JUST become
    // `(healthy)`, the very first request against a cold Next.js
    // standalone process took 3.65s (later requests: 197-341ms warm). CI's
    // `depends_on: condition: service_healthy` already requires several
    // passing health checks before this script even runs, but this leaves
    // real margin instead of chasing a false positive on deploy day. See
    // load-tests/README.md for the raw before/after numbers.
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const health = http.get(`${BASE_URL}/api/health`);
  check(health, {
    "health check is 200": (r) => r.status === 200,
    "health check reports ok": (r) => {
      try {
        return JSON.parse(r.body).status === "ok";
      } catch {
        return false;
      }
    },
  });

  const landing = http.get(`${BASE_URL}/`);
  check(landing, {
    "landing page is 200": (r) => r.status === 200,
  });

  sleep(1);
}
