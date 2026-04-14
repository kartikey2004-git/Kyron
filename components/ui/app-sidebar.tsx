"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  useModeAnimation,
  ThemeAnimationType,
} from "react-theme-switch-animation";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import UserButton from "@/modules/auth/components/user-button";
import { navigationConfig } from "../landing/data";
import type { NavigationItem, NavigationSection } from "@/types/navigation";
import { useUserProfile } from "@/modules/settings/hooks/use-user-profile";

const AppSideBar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { state } = useSidebar();

  // Theme switch animation hook
  const {
    ref: themeButtonRef,
    toggleSwitchTheme,
    isDarkMode,
  } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 400,
    easing: "ease-in-out",
    globalClassName: "dark",
  });

  const { data: user, isLoading: isUserLoading } = useUserProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    toggleSwitchTheme();
  }, [toggleSwitchTheme]);

  if (!mounted || isUserLoading || !user) return null;

  const username = user.name || "Guest";
  const userEmail = user.email || "";

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url);

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

              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-medium truncate">
                  @{username}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </span>
              </div>
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

                          ${
                            active ? "bg-muted text-foreground font-medium" : ""
                          }
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
                <div className="flex-shrink-0">
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

                <Button
                  ref={themeButtonRef}
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className="flex-shrink-0 h-8 w-8 p-0 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
