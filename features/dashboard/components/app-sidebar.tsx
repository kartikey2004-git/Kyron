"use client";

import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navigationConfig } from "../config/navigation";
import type { NavigationItem, NavigationSection } from "@/types/navigation";
import { UserButton } from "@/features/auth";
import { useUserProfile } from "@/features/settings";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const AppSideBar = () => {
  const pathname = usePathname();
  const mounted = useMounted();
  const { state } = useSidebar();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useUserProfile();

  // Hydration can briefly leave the client and server out of sync. Wait until the component has mounted on the client before using browser-dependent state, so the first render matches what the server sent.

  if (!mounted) return null;

  const username = user?.name || (isUserLoading ? "Loading…" : "Guest");
  const userEmail = user?.email || "";

  const isActive = (url: string) => {
    // Exact dashboard match only
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }

    // Exact match OR nested child routes
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between px-3 py-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center bg-muted rounded-md">
                <FaGithub className="h-4 w-4" />
              </div>

              {isUserLoading ? (
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : userError ? (
                <button
                  type="button"
                  onClick={() => refetchUser()}
                  className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Failed to load — retry
                </button>
              ) : (
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-medium truncate">
                    @{username}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationConfig.map((section: NavigationSection) => (
          <div key={section.title} className="px-2 py-2">
            {!isCollapsed && (
              <p className="px-2 mb-2 text-[10px] font-medium tracking-wider text-muted-foreground/70">
                {section.title}
              </p>
            )}

            <SidebarMenu className="space-y-1">
              {section.items.map((item: NavigationItem) => {
                const Icon = item.icon;
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.url}>
                    <div className="relative">
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 flex items-center bg-foreground rounded-full w-px" />
                      )}

                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={`
                          group flex items-center gap-3 rounded-md px-2 py-1.5
                          text-muted-foreground
                          transition-all duration-200 ease-out

                          hover:bg-muted/50 hover:text-foreground

                          ${active ? "text-foreground font-medium" : ""}
                        `}
                      >
                        <Link href={item.url}>
                          <Icon
                            className={`
                              h-4 w-4 shrink-0 transition-colors
                              ${
                                active
                                  ? "text-foreground"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }
                            `}
                          />

                          {!isCollapsed && (
                            <span className="truncate text-sm">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t pt-4">
        <div className="space-y-1 px-2 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                className={`w-full flex items-center rounded-md px-2 py-1.5`}
              >
                <div className="shrink-0">
                  <UserButton />
                </div>

                {!isCollapsed && (
                  <div className="ml-3 flex flex-col leading-tight min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Manage account
                    </span>
                  </div>
                )}

                <ThemeToggle className="shrink-0 border-none" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
