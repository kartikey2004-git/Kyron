"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder="Search repositories…"
        className="pl-9 h-9 text-sm rounded-md"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && !isLoading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">
          {filteredCount} results
        </span>
      )}
    </div>
  );
};
