"use client";

import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-3 animate-pulse">
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="h-3 w-1/3 rounded bg-muted" />
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="border-t pt-3 flex justify-between items-center">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-7 w-20 rounded-md bg-muted" />
      </div>
    </div>
  );
};
