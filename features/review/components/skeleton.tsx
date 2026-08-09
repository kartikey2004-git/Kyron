"use client";

import React from "react";

// Skeleton placeholder for the review list which closely matches the layout of the final review cards, helping maintain a stable layout while review data is being fetched.

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={`animate-pulse rounded-md bg-hairline dark:bg-white/5 ${className}`}
  />
);

// Two columns, matching ReviewList's xl grid — this used to stack in one
// column, so the page jumped sideways the moment the real cards arrived.
export const ReviewSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="space-y-4 rounded-md border border-hairline bg-card p-5 dark:border-white/10"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <div className="rounded-md bg-hairline/50 p-4 dark:bg-white/5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
