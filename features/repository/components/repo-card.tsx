"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Check, Plug, Loader2 } from "lucide-react";
import Link from "next/link";

/*
 
  - Displays a single repository with connection status in the connection flow.
 
  - The repository information comes from GitHub, while the backend adds an `isConnected` flag, so the component can distinguish repositories that are already connected from those that can still be linked.
 
*/

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  isConnected: boolean;
}

interface RepoCardProps {
  repo: Repository;
  onConnect: (repo: Repository) => void;
  connecting: boolean;
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  onConnect,
  connecting,
}) => {
  return (
    <article className="group flex flex-col rounded-md border border-hairline bg-card transition-colors duration-200 hover:border-foreground/30 dark:border-white/10">
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-heading-sm text-card-foreground">
              {repo.name}
            </h3>

            {repo.isConnected && (
              <span className="flex shrink-0 items-center gap-1 rounded-md border border-hairline px-2 py-0.5 text-meta text-muted-foreground dark:border-white/10">
                <Check className="size-3" /> connected
              </span>
            )}
          </div>

          <Link
            href={repo.html_url}
            target="_blank"
            className="shrink-0 rounded-md p-1.5 text-stone transition-colors hover:bg-hairline/60 hover:text-foreground dark:hover:bg-white/5"
          >
            <ExternalLink className="size-4" />
          </Link>
        </div>

        <p className="-mt-1.5 truncate font-mono text-meta text-stone">
          {repo.full_name}
        </p>

        <p className="line-clamp-2 min-h-11 text-body text-muted-foreground">
          {repo.description ?? (
            <span className="text-stone">No description provided</span>
          )}
        </p>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-md border border-hairline bg-hairline/40 px-2 py-0.5 text-meta text-muted-foreground dark:border-white/10 dark:bg-white/5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-b-md border-t border-hairline bg-hairline/40 px-5 py-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex min-w-0 items-center gap-4">
          {repo.language && (
            <span className="truncate text-meta text-muted-foreground">
              {repo.language}
            </span>
          )}

          <span className="flex items-center gap-1 text-meta tabular-nums text-muted-foreground">
            <Star className="size-3.5" />
            {repo.stargazers_count.toLocaleString()}
          </span>
        </div>

        <Button
          size="sm"
          onClick={() => onConnect(repo)}
          disabled={connecting || repo.isConnected}
          variant={
            repo.isConnected ? "outline" : connecting ? "ghost" : "default"
          }
        >
          {repo.isConnected ? (
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Connected
            </span>
          ) : connecting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Connecting…
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Plug className="h-3.5 w-3.5" /> Connect
            </span>
          )}
        </Button>
      </div>
    </article>
  );
};
