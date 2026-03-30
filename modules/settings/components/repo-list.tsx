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
import { Github, Loader2, Unlink } from "lucide-react";
import { useConnectedRepositories } from "../hooks/use-connected-repositories";
import {
  useDisconnectRepository,
  useDisconnectAllRepositories,
} from "../hooks/use-disconnect-repository";
import { ConnectedRepository } from "../hooks/use-connected-repositories";
import { Skeleton } from "@/components/ui/skeleton";
import RepositoryItem from "./repository-item";

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
      <Card className={className}>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Repositories connected for code review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
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
      <Card className={className}>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Manage your connected Github Repositories for code review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load repositories</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Manage your connected Github Repositories for code review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Github className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No connected repositories
            </h3>
            <p className="text-muted-foreground">
              Connect your GitHub repositories to enable automated code reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your connected Github Repositories for code review
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4" />
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

      <CardContent>
        <div className="space-y-3">
          {repositories.map((repo: ConnectedRepository) => (
            <RepositoryItem
              key={repo.id}
              repository={repo}
              onDisconnect={() => handleDisconnectRepository(repo.id)}
              isDisconnecting={disconnectRepository.isPending}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {repositories.length} repository
              {repositories.length !== 1 ? "ies" : ""} connected
            </span>
            <span>Webhooks configured for pull request events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepoList;
