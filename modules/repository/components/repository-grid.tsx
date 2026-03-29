"use client";

import React from "react";
import { SkeletonCard } from "./skeleton-card";
import { RepoCard, Repository } from "./repo-card";
import { Search } from "lucide-react";

interface RepositoryGridProps {
  isLoading: boolean;
  filteredRepositories: Repository[];
  searchQuery: string;
  onConnectRepo: (repo: Repository) => void;
  localConnectingId: number | null;
}

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({
  isLoading,
  filteredRepositories,
  searchQuery,
  onConnectRepo,
  localConnectingId,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (filteredRepositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Search className="h-10 w-10 opacity-40" />

        <p className="text-base font-medium text-center">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "No repositories found"}
        </p>

        <p className="text-sm opacity-70 text-center">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredRepositories.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          onConnect={onConnectRepo}
          connecting={localConnectingId === repo.id}
        />
      ))}
    </div>
  );
};
