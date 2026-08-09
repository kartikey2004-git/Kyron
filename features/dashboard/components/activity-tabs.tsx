import React, { useState } from "react";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MonthlyActivity, Tab, TABS } from "../types";

/*

  - Tabbed breakdown of the dashboard's monthly activity.
  
  - All metrics shown here are derived from the same six-month activity dataset used by the chart. No additional data is fetched, ensuring the chart and summary always stay in sync.

*/

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
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-hairline dark:bg-white/10">
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
    data.reduce((sum, m) => sum + m.commits, 0) / data.length
  );
  const mostActiveMonth = data.reduce(
    (max, month) => (month.commits > max.commits ? month : max),
    data[0]
  );
  const totalPRs = data.reduce((sum, m) => sum + m.prs, 0);
  const totalReviews = data.reduce((sum, m) => sum + m.reviews, 0);

  const formatTabLabel = (tab: Tab): string =>
    tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ");

  const renderOverview = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1.5 rounded-md border border-hairline p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <GitCommit className="size-3.5 text-chart-1" />
            <span className="text-meta text-stone">Commits</span>
          </div>
          <p className="text-heading-md tabular-nums text-foreground">
            {lastMonth?.commits ?? 0}
          </p>
          <p className="text-meta text-stone">this month</p>
        </div>
        <div className="space-y-1.5 rounded-md border border-hairline p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <GitPullRequest className="size-3.5 text-chart-2" />
            <span className="text-meta text-stone">PRs</span>
          </div>
          <p className="text-heading-md tabular-nums text-foreground">
            {lastMonth?.prs ?? 0}
          </p>
          <p className="text-meta text-stone">this month</p>
        </div>
        <div className="space-y-1.5 rounded-md border border-hairline p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="size-3.5 text-chart-3" />
            <span className="text-meta text-stone">Reviews</span>
          </div>
          <p className="text-heading-md tabular-nums text-foreground">
            {lastMonth?.reviews ?? 0}
          </p>
          <p className="text-meta text-stone">this month</p>
        </div>
      </div>

      <div className="space-y-2.5 rounded-md border border-hairline p-4 dark:border-white/10">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="size-3.5 text-stone" />
          <span className="text-body-strong text-foreground">
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
            <span className="text-meta text-muted-foreground">{label}</span>
            <span className="text-meta tabular-nums text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-md border border-hairline p-4 dark:border-white/10">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="size-3.5 text-stone" />
          <span className="text-body-strong text-foreground">
            Monthly commits
          </span>
        </div>
        {data.map((month) => (
          <div key={month.name} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-meta text-stone">
              {month.name}
            </span>
            <ActivityBar value={month.commits} max={maxCommits} />
            <span className="w-6 text-right text-meta tabular-nums text-foreground">
              {month.commits}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommits = () => (
    <div className="space-y-2">
      <p className="mb-4 text-meta text-muted-foreground">
        Commit activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 rounded-md border border-hairline p-3 dark:border-white/10"
        >
          <span className="w-7 shrink-0 text-meta text-foreground">
            {month.name}
          </span>
          <ActivityBar
            value={month.commits}
            max={maxCommits}
            color="bg-chart-1"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <GitCommit className="size-3.5 text-stone" />
            <span className="w-7 text-right text-meta tabular-nums text-foreground">
              {month.commits}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPullRequests = () => (
    <div className="space-y-2">
      <p className="mb-4 text-meta text-muted-foreground">
        Pull request activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 rounded-md border border-hairline p-3 dark:border-white/10"
        >
          <span className="w-7 shrink-0 text-meta text-foreground">
            {month.name}
          </span>
          <ActivityBar value={month.prs} max={maxPRs} color="bg-chart-2" />
          <div className="flex items-center gap-1.5 shrink-0">
            <GitPullRequest className="size-3.5 text-stone" />
            <span className="w-5 text-right text-meta tabular-nums text-foreground">
              {month.prs}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-2">
      <p className="mb-4 text-meta text-muted-foreground">
        Code review activity by month
      </p>
      {data.map((month) => (
        <div
          key={month.name}
          className="flex items-center gap-3 rounded-md border border-hairline p-3 dark:border-white/10"
        >
          <span className="w-7 shrink-0 text-meta text-foreground">
            {month.name}
          </span>
          <ActivityBar
            value={month.reviews}
            max={maxReviews}
            color="bg-chart-3"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <MessageSquare className="size-3.5 text-stone" />
            <span className="w-5 text-right text-meta tabular-nums text-foreground">
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
      <div className="flex shrink-0 border-b border-hairline dark:border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px whitespace-nowrap border-b px-4 py-3 text-meta transition-colors ${
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-stone hover:text-foreground"
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
