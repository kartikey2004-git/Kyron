import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../actions";

/*

React Query hook for fetching the authenticated user's profile.
 
    - The profile is shared across multiple parts of the application, including the settings page, profile dialog, and account menu. 
    
    - Using a single query key ensures every consumer reads the same cached data, so a profile update only needs to invalidate one query to refresh the UI everywhere.

*/

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const result = await getUserProfile();
      if (!result) {
        throw new Error("User profile not found");
      }
      return {
        ...result,

        // Convert Date objects returned by the server into ISO strings before exposing the data to client components.

        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };
    },

    // Profile information changes infrequently. A longer stale time avoids unnecessary refetches during navigation, while profile updates refresh this query immediately through explicit cache invalidation.

    staleTime: 1000 * 60 * 5, //  cache for 5 minutes

    // The user's profile doesn't typically change simply because the browser window regains focus, so avoid an automatic refetch.

    refetchOnWindowFocus: false,
  });
};
