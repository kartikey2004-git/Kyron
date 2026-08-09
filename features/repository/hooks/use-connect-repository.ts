"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../actions";
import { toast } from "sonner";

/*
  
React Query mutation for connecting a repository.
 
    - A successful connection affects multiple parts of the application, so instead of manually updating each cached query, this hook invalidates the affected data and lets React Query fetch the latest state.

 */

export const useConnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      owner,
      githubId,
      repo,
    }: {
      owner: string;
      githubId: number;
      repo: string;
    }) => {
      return await connectRepository(owner, githubId, repo);
    },
    onSuccess: () => {
      // Connecting a repository changes the available repositories, the list of connected repositories, and the dashboard metrics. Invalidate each query so the UI refreshes with the latest data.

      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Repository connected successfully");
    },
    onError: (error) => {
      toast.error("Failed to connect repository");
      console.error("Error connecting repository:", error);
    },
  });
};
