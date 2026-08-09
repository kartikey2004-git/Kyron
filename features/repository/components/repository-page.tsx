"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRepositories } from "@/features/repository/hooks/use-repositories";
import { Repository } from "@/features/repository/components/repo-card";
import { RepositoryHeader } from "@/features/repository/components/repository-header";
import { RepositorySearch } from "@/features/repository/components/repository-search";
import { RepositoryGrid } from "@/features/repository/components/repository-grid";
import { SkeletonCard } from "@/features/repository/components/skeleton-card";
import { useConnectRepository } from "@/features/repository/hooks/use-connect-repository";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/*

  - Repositories are loaded page by page, so search and the connected count only operate over pages already fetched, not every repository the user has on GitHub, until the user has scrolled far enough to load the rest.

  - localConnectingId tracks which specific repo card is in mid-connect.
    
*/

export const RepositoryPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useRepositories();

  const { mutate: connectRepository } = useConnectRepository();

  const [searchQuery, setSearchQuery] = useState("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null
  );

  // Sentinel div at the bottom of the grid for infinite scroll instead of a "load more" button. Loading the next page just means scrolling this element into view.

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    // Recreate the observer when the pagination state changes so it always uses the latest values. Remove the previous observer first to avoid having multiple observers watching the same target.

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRepositories = data?.pages.flatMap((page) => page) ?? [];

  // Client-side filter over whatever pages are already loaded, there's no server-side search here, so a repo the user hasn't scrolled to yet won't show up until its page has been fetched.

  const filteredRepositories = allRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedCount = allRepositories.filter((r) => r.isConnected).length;

  const handleConnectRepo = (repo: Repository) => {
    // mark this card as connecting while the request is in progress and clear it when the request finishes so a failed connection does not leave the card stuck in a loading state.

    setLocalConnectingId(repo.id);

    connectRepository(
      {
        owner: repo.full_name.split("/")[0],
        githubId: repo.id,
        repo: repo.name,
      },
      {
        onSuccess: () => {
          setLocalConnectingId(null);
        },
        onError: () => {
          setLocalConnectingId(null);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <RepositoryHeader
        isLoading={isLoading}
        totalRepositories={allRepositories.length}
        connectedCount={connectedCount}
        actions={
          <RepositorySearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredCount={filteredRepositories.length}
            isLoading={isLoading}
          />
        }
      />

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span className="text-body">
              Failed to load repositories. Please try again.
            </span>

            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <RepositoryGrid
        isLoading={isLoading}
        filteredRepositories={filteredRepositories}
        searchQuery={searchQuery}
        onConnectRepo={handleConnectRepo}
        localConnectingId={localConnectingId}
      />

      <div ref={observerTarget}>
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
          </div>
        )}
      </div>
    </div>
  );
};
