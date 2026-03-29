import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-muted/60 ${className}`} />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
    <div className="grid gap-4 grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[100px] rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-[280px] rounded-lg" />
      <Skeleton className="h-[280px] rounded-lg" />
    </div>
    <Skeleton className="h-[440px] rounded-lg" />
  </div>
);
