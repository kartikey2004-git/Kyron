"use client";

import React from "react";
import { SkeletonCard } from "./skeleton-card";
import { RepoCard, Repository } from "./repo-card";
import { Search } from "lucide-react";

/*
  
  Repository grid which contains the list of repositories with connection status for the connection page.
  
    - renders the repositories it receives. Data fetching regarding connection status and repositories, then supports searching, filtering, and pagination happen upstream on this component.
 
*/

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (filteredRepositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-hairline py-24 text-center dark:border-white/10">
        <Search className="size-8 text-stone" />

        <p className="text-heading-sm text-foreground">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "No repositories found"}
        </p>

        <p className="max-w-sm text-body text-muted-foreground">
          {searchQuery
            ? "Try a different search term."
            : "Kryon could not find any repositories on your GitHub account."}
        </p>
      </div>
    );
  }

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
