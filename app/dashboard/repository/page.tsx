"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRepositories } from "@/modules/repository/hooks/use-repositories";
import { Repository } from "@/modules/repository/components/repo-card";
import { RepositoryHeader } from "@/modules/repository/components/repository-header";
import { RepositorySearch } from "@/modules/repository/components/repository-search";
import { RepositoryGrid } from "@/modules/repository/components/repository-grid";
import { SkeletonCard } from "@/modules/repository/components/skeleton-card";

const RepositoryPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const [searchQuery, setSearchQuery] = useState("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null,
  );

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerTarget.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRepositories = data?.pages.flatMap((page) => page) ?? [];
  const filteredRepositories = allRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const connectedCount = allRepositories.filter((r) => r.isConnected).length;

  const handleConnectRepo = (repo: Repository) => {
    setLocalConnectingId(repo.id);
    // TODO: Implement connect repository logic
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 -mt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <RepositoryHeader
          isLoading={isLoading}
          totalRepositories={allRepositories.length}
          connectedCount={connectedCount}
        />

        <RepositorySearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredRepositories.length}
          isLoading={isLoading}
        />

        {isError && (
          <div className="rounded-md border bg-muted px-5 py-4 text-sm text-muted-foreground">
            Failed to load repositories. Please try again.
          </div>
        )}

        <RepositoryGrid
          isLoading={isLoading}
          filteredRepositories={filteredRepositories}
          searchQuery={searchQuery}
          onConnectRepo={handleConnectRepo}
          localConnectingId={localConnectingId}
        />
      </div>

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <SkeletonCard />}
      </div>
    </div>
  );
};

export default RepositoryPage;
