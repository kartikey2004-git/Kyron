"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Unlink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useConnectedRepositories } from "../hooks/use-connected-repositories";
import {
  useDisconnectRepository,
  useDisconnectAllRepositories,
} from "../hooks/use-disconnect-repository";
import { ConnectedRepository } from "../hooks/use-connected-repositories";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import RepositoryItem from "./repository-item";

/*
  
  Displays the user's connected repositories on the settings page with disconnect actions. Handles the loading, error, empty, and populated(pre filled data) states, each with its own dedicated UI.

  -  Keeping these states separate makes the component easier to read and maintain than combining them into a single conditional heavy render path.
  
*/

interface RepoListProps {
  className?: string;
}

const RepoList: React.FC<RepoListProps> = ({ className }) => {
  const { data: repositories, isLoading, error } = useConnectedRepositories();

  const disconnectRepository = useDisconnectRepository();

  const [disConnectAllOpen, setDisConnectAllOpen] = useState(false);

  const disconnectAllRepositories = useDisconnectAllRepositories();

  const handleDisconnectRepository = (repoId: string) => {
    disconnectRepository.mutate(repoId);
  };

  const handleDisconnectAll = () => {
    disconnectAllRepositories.mutate();
  };

  if (isLoading) {
    return (
      <Card
        className={cn(
          "gap-0 rounded-md border-hairline py-0 dark:border-white/10",
          className
        )}
      >
        <CardHeader className="border-b border-hairline px-5 py-4 dark:border-white/10">
          <CardTitle className="text-heading-sm">
            Connected repositories
          </CardTitle>
          <CardDescription className="text-meta">
            Repositories connected for code review
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-hairline p-4 dark:border-white/10"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={cn(
          "gap-0 rounded-md border-hairline py-0 dark:border-white/10",
          className
        )}
      >
        <CardHeader className="border-b border-hairline px-5 py-4 dark:border-white/10">
          <CardTitle className="text-heading-sm">
            Connected repositories
          </CardTitle>
          <CardDescription className="text-meta">
            Every pull request on these repositories is reviewed automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="py-12 text-center">
            <p className="text-body-strong text-destructive">
              Failed to load repositories
            </p>
            <p className="mt-1.5 text-body text-muted-foreground">
              {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card
        className={cn(
          "gap-0 rounded-md border-hairline py-0 dark:border-white/10",
          className
        )}
      >
        <CardHeader className="border-b border-hairline px-5 py-4 dark:border-white/10">
          <CardTitle className="text-heading-sm">
            Connected repositories
          </CardTitle>
          <CardDescription className="text-meta">
            Every pull request on these repositories is reviewed automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="py-12 text-center">
            <FaGithub className="mx-auto mb-4 size-8 text-stone" />
            <h3 className="mb-2 text-heading-sm text-foreground">
              No connected repositories
            </h3>
            <p className="mx-auto max-w-sm text-body text-muted-foreground">
              Connect a repository to have Kryon review every pull request on
              it.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "gap-0 rounded-md border-hairline py-0 dark:border-white/10",
        className
      )}
    >
      <CardHeader className="border-b border-hairline px-5 py-4 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-heading-sm">
              Connected repositories
            </CardTitle>
            <CardDescription className="text-meta">
              Every pull request on these repositories is reviewed
              automatically.
            </CardDescription>
          </div>
          {repositories && repositories.length > 0 && (
            <AlertDialog
              open={disConnectAllOpen}
              onOpenChange={setDisConnectAllOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disconnectAllRepositories.isPending}
                >
                  {disconnectAllRepositories.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Unlink className="size-4" />
                  )}
                  Disconnect All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Disconnect all repositories?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all repositories from your account and
                    delete their webhooks from GitHub. You will need to
                    reconnect them manually if you want to use them again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDisconnectAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Disconnect All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 py-5">
        <div className="space-y-3">
          {repositories.map((repo: ConnectedRepository) => (
            <RepositoryItem
              key={repo.id}
              repository={repo}
              onDisconnect={() => handleDisconnectRepository(repo.id)}
              // The mutation is shared across all rows, so `isPending` alone cannot tell which repository is being disconnected. Use `variables` to get the repo ID from the active request and show the loading state only on that row.

              isDisconnecting={
                disconnectRepository.isPending &&
                disconnectRepository.variables === repo.id
              }
            />
          ))}
        </div>
        <div className="mt-6 border-t border-hairline pt-4 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 text-meta text-stone">
            <span>
              {repositories.length}{" "}
              {repositories.length === 1 ? "repository" : "repositories"}{" "}
              connected
            </span>
            <span>Webhooks configured for pull request events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepoList;
