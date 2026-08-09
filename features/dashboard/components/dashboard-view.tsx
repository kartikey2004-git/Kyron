"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMonthlyActivity,
  getContributionCalendar,
} from "@/features/dashboard/actions";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { ContributionHeatmap } from "@/features/dashboard/components/contribution-heatmap";
import { ActivityTabs } from "@/features/dashboard/components/activity-tabs";
import { MonthlyActivityChart } from "@/features/dashboard/components/monthly-activity-chart";
import { DashboardSkeleton } from "@/features/dashboard/components/skeleton";
import {
  RecentReviews,
  ConnectedRepositories,
} from "@/features/dashboard/components/digest-panels";
import { PageHeader, Panel } from "@/components/shared/page-header";

export const DashboardView: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => await getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  const { data: monthlyActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  const { data: contributionCalendar, isLoading: calendarLoading } = useQuery({
    queryKey: ["contribution-calendar"],
    queryFn: async () => await getContributionCalendar(),
    refetchOnWindowFocus: false,
  });

  const isLoading = statsLoading || activityLoading || calendarLoading;

  // Recent reviews and Connected repositories view not just count fetch independently of the activity queries, so they stay outside the loading gate and carry their own loading states.

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Track your coding activity and contributions."
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentReviews />
            <ConnectedRepositories />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Panel
                title="Contribution graph"
                description="Daily activity over the last year"
              >
                {contributionCalendar && (
                  <ContributionHeatmap data={contributionCalendar} />
                )}
              </Panel>

              {monthlyActivity && (
                <MonthlyActivityChart data={monthlyActivity} height={200} />
              )}
            </div>

            <Panel bodyClassName="flex-1 overflow-hidden">
              {monthlyActivity && <ActivityTabs data={monthlyActivity} />}
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
};
