import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectRepository, disconnectAllRepositories } from "../actions";
import { toast } from "sonner";

/*
  
React Query mutations for repository management.
  
    - These hooks wrap the server actions used by the settings page to disconnect repositories. 
    
    - Besides performing the mutation, they keep the client cache in sync and provide consistent success/error feedback.

*/

export const useDisconnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // The server action reports expected failures through its { success: false} response. Convert those into thrown errors so React Query can handle all failures through its standard `onError` flow.

    mutationFn: async (repositoryId: string) => {
      const result = await disconnectRepository(repositoryId);

      if (!result.success) {
        throw new Error(result.error || "Failed to disconnect repository");
      }

      return result;
    },

    // Disconnecting a repository changes both the connected repository list and the dashboard statistics.

    // Invalidate those queries so the UI refreshes with the latest data.

    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      }

      toast.success("Repository disconnected successfully");
    },

    // Surface the error returned by the server action (or a fallback message) as a toast notification.

    onError: (error) => {
      toast.error(error.message || "Failed to disconnect repository");
    },
  });
};

// Disconnect every repository connected to the authenticated user's account.

export const useDisconnectAllRepositories = () => {
  const queryClient = useQueryClient();

  // Convert unsuccessful server responses into thrown errors, so React Query treats all failures consistently.

  return useMutation({
    mutationFn: async () => {
      const result = await disconnectAllRepositories();

      if (!result.success) {
        throw new Error(result.error || "Failed to disconnect repositories");
      }

      return result;
    },

    // Removing all repositories affects the same cached data as disconnecting a single repository.

    // Refresh those queries so the UI reflects the updated state immediately.

    onSuccess: (data) => {
      toast.success(`Disconnected ${data.count} repositories successfully`);
      queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },

    // Display a user-friendly error if the operation couldn't be completed.

    onError: (error) => {
      toast.error(error.message || "Failed to disconnect repositories");
    },
  });
};
