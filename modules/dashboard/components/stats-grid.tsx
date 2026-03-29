import React from "react";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import type { DashboardStats } from "../types";

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon: Icon, trend }) => (
  <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between gap-4">
    <div className="flex items-start justify-between">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
    <div>
      <p className="text-2xl font-semibold text-foreground tabular-nums">
        {value.toLocaleString()}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-muted-foreground">{sub}</p>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
    </div>
  </div>
);

interface StatsGridProps {
  stats?: DashboardStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid gap-4 grid-cols-4">
    <StatCard
      label="Total Commits"
      value={stats?.totalCommits ?? 0}
      sub="Last 12 months"
      icon={GitCommit}
    />
    <StatCard
      label="Pull Requests"
      value={stats?.totalPrs ?? 0}
      sub="All time"
      icon={GitPullRequest}
    />
    <StatCard
      label="Code Reviews"
      value={stats?.totalReviews ?? 0}
      sub="AI reviews completed"
      icon={MessageSquare}
    />
    <StatCard
      label="Repositories"
      value={stats?.totalRepos ?? 0}
      sub="Connected repos"
      icon={GitBranch}
    />
  </div>
);
