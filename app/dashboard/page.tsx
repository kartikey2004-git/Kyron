"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/modules/dashboard/actions";
import { StatsGrid } from "@/modules/dashboard/components/stats-grid";
import { ContributionHeatmap } from "@/modules/dashboard/components/contribution-heatmap";
import { ActivityTabs } from "@/modules/dashboard/components/activity-tabs";
import { MonthlyActivityChart } from "@/modules/dashboard/components/monthly-activity-chart";
import { DashboardSkeleton } from "@/modules/dashboard/components/skeleton";

const DashboardPage: React.FC = () => {
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

  const isLoading = statsLoading || activityLoading;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Overview
        </p>
        <h1 className="mt-1 text-[22px] font-medium tracking-[-0.04em] text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Track your coding activity and contributions.
        </p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="border border-border bg-card p-5 flex flex-col gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Contribution graph
                </p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  Daily activity across the last 6 months
                </p>
              </div>
              {monthlyActivity && (
                <ContributionHeatmap data={monthlyActivity} />
              )}
            </div>

            <div className="border border-border bg-card overflow-hidden flex flex-col">
              {monthlyActivity && <ActivityTabs data={monthlyActivity} />}
            </div>
          </div>

          {monthlyActivity && <MonthlyActivityChart data={monthlyActivity} />}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
