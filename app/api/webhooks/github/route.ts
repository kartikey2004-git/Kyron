import { reviewPullRequest } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/lib/logger";
import { withRequestContext } from "@/lib/request-context";
import { httpRequestDuration } from "@/lib/metrics";

const ROUTE = "webhooks.github";

export async function POST(request: NextRequest) {
  return withRequestContext(async () => {
    const logger = getLogger({ route: ROUTE });
    const stopTimer = httpRequestDuration.startTimer({
      route: ROUTE,
      method: "POST",
    });

    let statusCode = 200;

    try {
      const body = await request.json();

      const event = request.headers.get("x-github-event");

      if (event === "ping") {
        logger.info("ping webhook received");
        return NextResponse.json(
          { message: "Webhook received" },
          { status: 200 },
        );
      }

      // HANDLE PULL REQUEST EVENTS

      if (event === "pull_request") {
        const action = body.action;
        const repo = body.repository?.full_name;
        const prNumber = body.number;

        const [owner, repoName] = repo.split("/");

        if (
          action === "opened" ||
          action === "synchronize" ||
          action === "reopened"
        ) {
          try {
            await reviewPullRequest(owner, repoName, prNumber);
            logger.info({ repo, prNumber }, "review request sent successfully");
          } catch (error) {
            logger.error(
              {
                repo,
                prNumber,
                err: error instanceof Error ? error.message : String(error),
              },
              "review request failed",
            );
          }
        } else {
          logger.info({ action }, "skipping pr action");
        }
      }

      return NextResponse.json({ message: "Event processed" }, { status: 200 });
    } catch (error) {
      statusCode = 500;
      logger.error(
        { err: error instanceof Error ? error.message : String(error) },
        "webhook error",
      );
      return NextResponse.json({ message: "Webhook failed" }, { status: 500 });
    } finally {
      stopTimer({ status_code: String(statusCode) });
    }
  });
}
