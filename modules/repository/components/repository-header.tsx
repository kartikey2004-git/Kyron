"use client";

import React from "react";

interface RepositoryHeaderProps {
  isLoading: boolean;
  totalRepositories: number;
  connectedCount: number;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  isLoading,
  totalRepositories,
  connectedCount,
}) => {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Repositories
      </p>
      <h1 className="mt-1 text-[22px] font-medium tracking-[-0.04em] text-foreground">
        Connect a repository
      </h1>
      {!isLoading && (
        <p className="mt-1 text-[13px] text-muted-foreground">
          {totalRepositories} repos · {connectedCount} connected
        </p>
      )}
    </div>
  );
};
