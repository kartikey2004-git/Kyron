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

    // TODO: HANDLE PULL REQUEST EVENTS

    return NextResponse.json({ message: "Event processes" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ message: "Webhook failed" }, { status: 500 });
  }
}
