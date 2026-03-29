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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your coding activity and contributions
          </p>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Contribution Graph
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily activity across the last 6 months
                </p>
              </div>
              {monthlyActivity && (
                <ContributionHeatmap data={monthlyActivity} />
              )}
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
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
