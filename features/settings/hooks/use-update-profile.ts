import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserProfile } from "../actions";

/* 

React Query mutation for updating the user's profile.
 
   - Handles submitting profile changes, invalidate cached profile data after a successful update and get freshed data, and displaying success or error feedback.

*/

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Submit the updated profile information to the server.

    mutationFn: async (data: { name?: string }) => {
      return await updateUserProfile(data);
    },

    // The updated profile may be displayed in multiple places (such as the settings page and account menu).

    // Refresh the shared profile query so every consumer receives the latest data.

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },

    // Notify the user if the profile update could not be completed.

    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    },
  });
};
