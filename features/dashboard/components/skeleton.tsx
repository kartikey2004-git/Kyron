import React from "react";

// Loading state for the dashboard which mirrors the final dashboard layout so the page transitions smoothly once the real data loads, avoiding noticeable layout shifts.

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={`animate-pulse rounded-md bg-hairline dark:bg-white/5 ${className}`}
  />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-25" />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Skeleton className="h-70" />
      <Skeleton className="h-70" />
    </div>

    <Skeleton className="h-110" />
  </div>
);
