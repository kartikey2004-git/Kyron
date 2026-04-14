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
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <FaGithub className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium">{repoName}</h4>
            <Badge variant="secondary" className="text-xs">
              {owner}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              Connected {new Date(repository.createdAt).toLocaleDateString()}
            </span>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isDisconnecting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDisconnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect repository?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{repository.fullName}</strong> from
                your account and delete its webhook from GitHub. You'll need to
                reconnect it manually if you want to use it again.
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
