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
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Repositories
      </h1>

      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {totalRepositories} repos · {connectedCount} connected
        </p>
      )}
    </div>
  );
};
