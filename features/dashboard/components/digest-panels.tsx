"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, GitPullRequest } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Panel } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { useReviews } from "@/features/review";
import { useConnectedRepositories } from "@/features/settings";

/*

- Both panels use the same React Query keys as the Reviews and Settings pages, so they can reuse data already in the cache instead of making another request. This is also why the panels fetch the data themselves instead of receiving it as props.

- Each panel manages its own loading and empty states because the two requests are independent and may finish at different times. One panel should not block the other.

- PREVIEW_COUNT keeps the overview focused by showing only the most recent rows. The full lists are available through the "All reviews" and "Connect more" links.

*/

const PREVIEW_COUNT = 4;

function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1 text-meta text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <ArrowUpRight className="size-3" />
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-12 text-center">
      <Icon className="size-6 text-stone" />
      <p className="max-w-xs text-body text-muted-foreground">{children}</p>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="animate-pulse space-y-2 px-5 py-4">
      <div className="h-3.5 w-2/3 rounded bg-hairline dark:bg-white/5" />
      <div className="h-3 w-1/3 rounded bg-hairline dark:bg-white/5" />
    </div>
  );
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  failed: "destructive",
  pending: "secondary",
};

export const RecentReviews: React.FC = () => {
  const { reviews, isLoading } = useReviews();

  const recent = reviews.slice(0, PREVIEW_COUNT);

  return (
    <Panel
      title="Recent reviews"
      description="The latest pull requests Kryon has reviewed"
      action={<PanelLink href="/dashboard/reviews" label="All reviews" />}
      bodyClassName="flex-1 divide-y divide-hairline dark:divide-white/10"
    >
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)
      ) : recent.length === 0 ? (
        <EmptyState icon={Bot}>
          No reviews yet. Open a pull request on a connected repository and one
          will land here.
        </EmptyState>
      ) : (
        recent.map((review) => (
          <a
            key={review.id}
            href={review.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-hairline/40 dark:hover:bg-white/5"
          >
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <GitPullRequest className="size-3.5 shrink-0 text-stone" />

                <span className="font-mono text-meta tabular-nums text-stone">
                  #{review.prNumber}
                </span>

                <Badge
                  variant={STATUS_VARIANT[review.status] ?? "outline"}
                  className="rounded-md text-meta font-normal"
                >
                  {review.status}
                </Badge>
              </div>

              <p className="truncate text-body text-foreground">
                {review.prTitle}
              </p>

              <p className="truncate font-mono text-meta text-stone">
                {review.repository.owner}/{review.repository.name}
              </p>
            </div>

            <span className="shrink-0 text-meta text-stone">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </a>
        ))
      )}
    </Panel>
  );
};

export const ConnectedRepositories: React.FC = () => {
  const { data: repositories, isLoading } = useConnectedRepositories();

  const connected = repositories ?? [];
  const preview = connected.slice(0, PREVIEW_COUNT);
  const remaining = connected.length - preview.length;

  return (
    <Panel
      title="Connected repositories"
      description={
        isLoading
          ? "Loading…"
          : `${connected.length} watched for pull request events`
      }
      action={<PanelLink href="/dashboard/repository" label="Connect more" />}
      bodyClassName="flex-1 divide-y divide-hairline dark:divide-white/10"
    >
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)
      ) : preview.length === 0 ? (
        <EmptyState icon={FaGithub}>
          Nothing connected yet. Connect a repository to have Kryon review every
          pull request on it.
        </EmptyState>
      ) : (
        <>
          {preview.map((repo) => {
            const [owner, name] = repo.fullName.split("/");

            return (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-hairline/40 dark:hover:bg-white/5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FaGithub className="size-4 shrink-0 text-stone" />

                  <div className="min-w-0">
                    <p className="truncate text-body text-foreground">{name}</p>
                    <p className="truncate font-mono text-meta text-stone">
                      {owner}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-meta text-stone">
                  {new Date(repo.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </a>
            );
          })}

          {remaining > 0 && (
            <Link
              href="/dashboard/settings"
              className="block px-5 py-3 text-meta text-muted-foreground transition-colors hover:text-foreground"
            >
              {remaining} more in settings
            </Link>
          )}
        </>
      )}
    </Panel>
  );
};
