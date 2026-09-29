import React from "react";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
  ArrowUp,
  ArrowDown,
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
  <div className="border border-border bg-card p-5 flex flex-col justify-between gap-5">
    <div className="flex items-start justify-between gap-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
    </div>
    <div>
      <p className="text-[28px] font-medium tracking-[-0.05em] text-foreground tabular-nums leading-none">
        {value.toLocaleString()}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-[12px] text-muted-foreground">{sub}</p>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[12px] font-medium ${trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {trend >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(trend)}%
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
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="Commits"
      value={stats?.totalCommits ?? 0}
      sub="Last 12 months"
      icon={GitCommit}
    />
    <StatCard
      label="Pull requests"
      value={stats?.totalPrs ?? 0}
      sub="All time"
      icon={GitPullRequest}
    />
    <StatCard
      label="Code reviews"
      value={stats?.totalReviews ?? 0}
      sub="Completed by Kryon"
      icon={MessageSquare}
    />
    <StatCard
      label="Repositories"
      value={stats?.totalRepos ?? 0}
      sub="Connected"
      icon={GitBranch}
    />
  </div>
);
