import { reviewPullRequest } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = request.headers.get("x-github-event");

    if (event === "ping") {
      console.log("Ping webhook received");
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
        reviewPullRequest(owner, repoName, prNumber)
          .then(() =>
            console.log(
              `Review request sent successfully for: ${repo} #${prNumber}`,
            ),
          )
          .catch((error) =>
            console.log(`Review failed for ${repo} #${prNumber}:`, error),
          );
      } else {
        console.log("Skipping PR action:", { action });
      }
    }

    return NextResponse.json({ message: "Event processed" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook failed" }, { status: 500 });
  }
}
