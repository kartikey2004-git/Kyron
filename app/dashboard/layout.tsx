import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import AppSideBar from "@/components/ui/app-sidebar";
import { cn } from "@/lib/utils";
import { requireAuthenticated } from "@/modules/auth/utils/auth-utils";
import { httpRequestDuration } from "@/lib/metrics";

// Next.js's App Router has no middleware.ts in this codebase (see
// CLAUDE.md) and Server Components don't expose a response-status hook the
// way a route handler does, so this is the closest thing to per-request
// HTTP metrics /dashboard* traffic gets: every nested page goes through
// this one shared layout, mirroring how requireAuthenticated() itself is
// already centralized here rather than in per-page code. `status_code`
// here is a proxy (200 rendered, 302 redirected to /login, 500 unexpected
// error) — it's layout render outcome, not a literal captured HTTP status.
function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const stopTimer = httpRequestDuration.startTimer({
    route: "dashboard",
    method: "GET",
  });

  try {
    await requireAuthenticated();
    stopTimer({ status_code: "200" });
  } catch (error) {
    stopTimer({ status_code: isNextRedirectError(error) ? "302" : "500" });
    throw error;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSideBar />
        <SidebarRail />

        <SidebarInset>
          <header className={cn("flex h-14 shrink-0 items-center gap-3 border-b border-border px-6")}>
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
