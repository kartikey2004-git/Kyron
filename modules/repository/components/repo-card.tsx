"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Check, Plug, Loader2 } from "lucide-react";
import Link from "next/link";

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
    <article className="group flex flex-col rounded-md border bg-card hover:border-foreground/30 transition-all duration-200 hover:shadow-sm">
      <div className="flex flex-col gap-3.5 p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate text-base">
              {repo.name}
            </h3>

            {repo.isConnected && (
              <span className="flex items-center gap-1 text-xs border text-muted-foreground px-2 py-0.5 rounded-full">
                <Check className="h-3 w-3" /> connected
              </span>
            )}
          </div>

          <Link
            href={repo.html_url}
            target="_blank"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Full name */}
        <p className="text-xs text-muted-foreground/70 -mt-1">
          {repo.full_name}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.75rem]">
          {repo.description ?? (
            <span className="opacity-50">No description provided</span>
          )}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full border text-muted-foreground bg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/50 rounded-b-md">
        <div className="flex items-center gap-4">
          {repo.language && (
            <span className="text-sm text-muted-foreground">
              {repo.language}
            </span>
          )}

          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
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
          className="h-8 px-3 text-xs rounded-md shadow-none"
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
