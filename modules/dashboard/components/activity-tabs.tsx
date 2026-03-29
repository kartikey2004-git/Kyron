import React, { useState } from "react";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MonthlyActivity, Tab, TABS } from "../types";

interface ActivityBarProps {
  value: number;
  max: number;
  color?: string;
}

const ActivityBar: React.FC<ActivityBarProps> = ({
  value,
  max,
  color = "bg-chart-1",
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface ActivityTabsProps {
  data: MonthlyActivity[];
}

export const ActivityTabs: React.FC<ActivityTabsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const maxCommits = Math.max(...data.map((m) => m.commits));
  const maxPRs = Math.max(...data.map((m) => m.prs));
  const maxReviews = Math.max(...data.map((m) => m.reviews));

  const lastMonth = data[data.length - 1];
  const avgCommits = Math.round(
    data.reduce((sum, m) => sum + m.commits, 0) / data.length,
  );
  const mostActiveMonth = data.reduce(
    (max, month) => (month.commits > max.commits ? month : max),
    data[0],
  );
  const totalPRs = data.reduce((sum, m) => sum + m.prs, 0);
  const totalReviews = data.reduce((sum, m) => sum + m.reviews, 0);

  const formatTabLabel = (tab: Tab): string =>
    tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ");

  const renderOverview = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-border rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <GitCommit className="h-3.5 w-3.5 text-chart-1" />
            <span className="text-[11px] text-muted-foreground">Commits</span>
          </div>
          <p className="text-xl font-semibold text-foreground">
            {lastMonth?.commits ?? 0}
          </p>
          <p className="text-[10px] text-muted-foreground">this month</p>
        </div>
        <div className="border border-border rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <GitPullRequest className="h-3.5 w-3.5 text-chart-2" />
            <span className="text-[11px] text-muted-foreground">PRs</span>
          </div>
          <p className="text-xl font-semibold text-foreground">
            {lastMonth?.prs ?? 0}
          </p>
          <p className="text-[10px] text-muted-foreground">this month</p>
        </div>
        <div className="border border-border rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-chart-3" />
            <span className="text-[11px] text-muted-foreground">Reviews</span>
          </div>
          <p className="text-xl font-semibold text-foreground">
            {lastMonth?.reviews ?? 0}
          </p>
          <p className="text-[10px] text-muted-foreground">this month</p>
        </div>
      </div>

      <div className="border border-border rounded-lg p-3 space-y-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Productivity insights
          </span>
        </div>
        {[
          { label: "Avg commits / month", value: avgCommits },
          { label: "Most active month", value: mostActiveMonth?.name ?? "—" },
          { label: "Total PRs opened", value: totalPRs },
          { label: "Total reviews done", value: totalReviews },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-semibold text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Monthly commits
          </span>
        </div>
        {data.map((month) => (
          <div key={month.name} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-6 shrink-0">
              {month.name}
            </span>
            <ActivityBar value={month.commits} max={maxCommits} />
            <span className="text-[11px] font-medium text-foreground w-6 text-right">
              {month.commits}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommits = () => (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Commit activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 p-3 border border-border rounded-lg"
        >
          <span className="text-xs font-medium text-foreground w-7 shrink-0">
            {month.name}
          </span>
          <ActivityBar
            value={month.commits}
            max={maxCommits}
            color="bg-chart-1"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground w-7 text-right">
              {month.commits}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPullRequests = () => (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Pull request activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 p-3 border border-border rounded-lg"
        >
          <span className="text-xs font-medium text-foreground w-7 shrink-0">
            {month.name}
          </span>
          <ActivityBar value={month.prs} max={maxPRs} color="bg-chart-2" />
          <div className="flex items-center gap-1.5 shrink-0">
            <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground w-5 text-right">
              {month.prs}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Code review activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 p-3 border border-border rounded-lg"
        >
          <span className="text-xs font-medium text-foreground w-7 shrink-0">
            {month.name}
          </span>
          <ActivityBar
            value={month.reviews}
            max={maxReviews}
            color="bg-chart-3"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground w-5 text-right">
              {month.reviews}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "commits":
        return renderCommits();
      case "pull-requests":
        return renderPullRequests();
      case "reviews":
        return renderReviews();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            }`}
          >
            {formatTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
    </div>
  );
};
