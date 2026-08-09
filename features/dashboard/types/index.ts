// Shared dashboard types and constants. They live in their own module so both server and client code can use the same definitions without importing server-only code.

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

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const TABS = [
  "overview",
  "commits",
  "pull-requests",
  "reviews",
] as const;
export type Tab = (typeof TABS)[number];
