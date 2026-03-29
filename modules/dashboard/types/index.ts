export interface MonthlyActivity {
  name: string;
  commits: number;
  prs: number;
  reviews: number;
}

export interface DashboardStats {
  totalCommits: number;
  totalPrs: number;
  totalReviews: number;
  totalRepos: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface HeatmapData {
  weeks: ContributionWeek[];
  totalContributions: number;
  monthLabels: { label: string; weekIndex: number }[];
}

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const MONTH_IDX: Record<string, number> = Object.fromEntries(
  MONTH_NAMES.map((m, i) => [m, i]),
);

export const TABS = ["overview", "commits", "pull-requests", "reviews"] as const;
export type Tab = typeof TABS[number];

export function seededRandom(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}
