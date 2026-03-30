import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectRepository, disconnectAllRepositories } from "../actions";
import { toast } from "sonner";

export const useDisconnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repositoryId: string) => {
      const result = await disconnectRepository(repositoryId);

      if (!result.success) {
        throw new Error(result.error || "Failed to disconnect repository");
      }

      return result;
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      }

      toast.success("Repository disconnected successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disconnect repository");
    },
  });
};

export const useDisconnectAllRepositories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await disconnectAllRepositories();

      if (!result.success) {
        throw new Error(result.error || "Failed to disconnect repositories");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(`Disconnected ${data.count} repositories successfully`);
      queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disconnect repositories");
    },
  });
};
