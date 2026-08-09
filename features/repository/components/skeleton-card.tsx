"use client";

import React from "react";

// Skeleton placeholder for a repository card which mirrors the final card layout so the repository grid stays visually stable while the data is being fetched.

export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3 rounded-md border border-hairline bg-card p-5 dark:border-white/10">
      <div className="h-4 w-2/3 rounded bg-hairline dark:bg-white/5" />
      <div className="h-3 w-1/3 rounded bg-hairline dark:bg-white/5" />

      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-hairline dark:bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-hairline dark:bg-white/5" />
      </div>

      <div className="flex items-center justify-between border-t border-hairline pt-3 dark:border-white/10">
        <div className="h-3 w-16 rounded bg-hairline dark:bg-white/5" />
        <div className="h-7 w-20 rounded-md bg-hairline dark:bg-white/5" />
      </div>
    </div>
  );
};
