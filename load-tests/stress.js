// Pushes well past load.js's VU ceiling against /api/webhooks/github —
// the one endpoint in this system that's genuinely exposed to external
// traffic spikes (any GitHub repo with the webhook configured can send a
// burst of pull_request events at once). Goal: find where it breaks, not
// prove it doesn't.
//
// Uses `x-github-event: ping` exclusively, not `pull_request` — a real
// pull_request payload would fire reviewPullRequest() for every single
// request, hammering the GitHub and Gemini APIs for no reason and
// potentially burning through rate limits/API spend during what's supposed
// to be a local stress test of the *ingestion* path, not the AI pipeline.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "30s", target: 0 },
  ],
  // Deliberately no thresholds that fail the run — this script's purpose
  // is to observe and report the breaking point, not gate a pipeline.
};

const payload = JSON.stringify({ zen: "Design for failure." });
const params = {
  headers: {
    "Content-Type": "application/json",
    "x-github-event": "ping",
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/api/webhooks/github`, payload, params);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(0.1);
}
