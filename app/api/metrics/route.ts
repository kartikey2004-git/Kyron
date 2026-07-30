import { NextResponse } from "next/server";
import { registry } from "@/lib/metrics";

export async function GET() {
  const body = await registry.metrics();

  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": registry.contentType },
  });
}
