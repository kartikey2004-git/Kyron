import { reviewPullRequest } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = request.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json(
        { message: "Webhook received" },
        { status: 200 },
      );
    }

    console.log("Webhook received:", event);

    // HANDLE PULL REQUEST EVENTS

    if (event === "pull_request") {
      const action = body.action;
      const repo = body.repository?.full_name;
      const prNumber = body.number;

      const [owner,repoName] = repo.split("/")

      if (action === "open" || action === "synchronize") {
        reviewPullRequest(owner, repoName, prNumber)
          .then(() => console.log(`Review completed for ${repo} #${prNumber}`))
          .catch((error) =>
            console.log(`Review failed for {repo} #${prNumber}:`, error),
          );
      }
    }

    return NextResponse.json({ message: "Event processes" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook failed" }, { status: 500 });
  }
}
