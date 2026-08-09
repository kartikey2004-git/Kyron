"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

/*
 
  Search controls for the repository list.
 
    - component for search and showing result count. Filtering the repositories remains the responsibility of the parent component.

*/

interface RepositorySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredCount: number;
  isLoading: boolean;
}

export const RepositorySearch: React.FC<RepositorySearchProps> = ({
  searchQuery,
  onSearchChange,
  filteredCount,
  isLoading,
}) => {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-stone" />

      <Input
        placeholder="Search repositories…"
        aria-label="Search repositories"
        className="h-9 rounded-md border-hairline pr-20 pl-9 text-body dark:border-white/10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {searchQuery && !isLoading && (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-meta tabular-nums text-stone">
          {filteredCount} results
        </span>
      )}
    </div>
  );
};
