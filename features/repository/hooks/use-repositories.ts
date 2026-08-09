"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserRepositories } from "../actions";

/*

  Fetches repositories page by page so the picker can load more results as needed without fetching the user's entire repository list at once.
 
    - GitHub doesn't include the total number of repositories in this endpoint, so pagination continues as long as a full page of results is returned. Receiving fewer than the requested page size means there are no more repositories to load.

*/

export const useRepositories = () => {
  return useInfiniteQuery({
    queryKey: ["repositories"],
    queryFn: async ({ pageParam }) => {
      const data = await fetchUserRepositories(pageParam, 10);
      return data;
    },
    // If GitHub returns all 10 repositories we requested, assume another page may exist. A shorter page indicates we've reached the end.

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
