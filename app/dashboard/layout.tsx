import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { Separator } from "@/components/ui/separator";
import AppSideBar from "@/components/ui/app-sidebar";
import { cn } from "@/lib/utils";
import { requireAuthenticated } from "@/modules/auth/utils/auth-utils";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuthenticated();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSideBar />
        <SidebarRail />

        <SidebarInset>
          <header
            className={cn(
              "flex h-16 shrink-0 items-center gap-2 px-6 py-6 mt-3",
            )}
          >
            <SidebarTrigger className="-ml-1" />

            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
