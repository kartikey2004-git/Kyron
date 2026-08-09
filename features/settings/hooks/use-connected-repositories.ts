import { useQuery } from "@tanstack/react-query";
import { getConnectedRepositories } from "../actions";

// Date fields are exposed as ISO strings instead of JavaScript Date objects, so we need data can be safely cached, serialized, and shared with client components.

export interface ConnectedRepository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// The list of connected repositories only changes when a repository is connected or disconnected. Those actions explicitly invalidate this query, allowing a longer staleTime to reduce unnecessary refetches during normal navigation.

export const useConnectedRepositories = () => {
  return useQuery<ConnectedRepository[]>({
    queryKey: ["connected-repositories"],
    queryFn: async () => {
      const result = await getConnectedRepositories();
      return result.map((repo) => ({
        ...repo,

        // Convert Date objects returned by the server into ISO strings before exposing them to client components.

        createdAt: repo.createdAt.toISOString(),
        updatedAt: repo.updatedAt.toISOString(),
      }));
    },

    /*
      
      - Connected repositories rarely change on their own. They are refreshed immediately when connect/disconnect actions invalidate this query

      - So longer stale time simply avoids  so unnecessary refetches between those user-driven updates.
    
    */

    staleTime: 1000 * 60 * 5, // 5 minutes

    // The data doesn't change just because the user switches back to the tab, so avoid refetching on every window focus.

    refetchOnWindowFocus: false,
  });
};
