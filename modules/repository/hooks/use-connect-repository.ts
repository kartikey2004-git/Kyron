"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../actions";
import { toast } from "sonner";

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
