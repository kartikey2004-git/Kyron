"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ConnectedRepository } from "../hooks/use-connected-repositories";

/*
  
  - Represents a single connected repository in the settings page. Connected repositories are stored with a single `fullName` (`owner/repository`) field. 
  
  - Derives the owner and repository names from that value so the database only stores the information once while the UI can present it more clearly.

*/

interface RepositoryItemProps {
  repository: ConnectedRepository;
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

const RepositoryItem: React.FC<RepositoryItemProps> = ({
  repository,
  onDisconnect,
  isDisconnecting,
}) => {
  const [owner, repoName] = repository.fullName.split("/");

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-hairline p-4 transition-colors hover:bg-hairline/50 dark:border-white/10 dark:hover:bg-white/5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0">
          <FaGithub className="size-4 text-stone" />
        </div>
        <div className="space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <h4 className="truncate text-body-strong text-foreground">
              {repoName}
            </h4>

            <Badge
              variant="secondary"
              className="rounded-md text-meta font-normal"
            >
              {owner}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-meta text-stone">
            <span>
              Connected {new Date(repository.createdAt).toLocaleDateString()}
            </span>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDisconnecting}
              aria-label="Disconnect repository"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDisconnecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect repository?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{repository.fullName}</strong> from
                your account and delete its webhook from GitHub. You&apos;ll
                need to reconnect it manually if you want to use it again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDisconnect}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RepositoryItem;
