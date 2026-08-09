"use client";

import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../actions";

/*
 
  React Query hook for getting the user's AI review history.
 
   - This hook handles fetching, caching, and refetching the review list while exposing a simple API for UI. Reviews are generated asynchronously after a pull request is processed, so they may not appear immediately after a review is requested.

*/

export const useReviews = () => {
  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => await getReviews(),

    // AI reviews are generated asynchronouslyin background jobs, so a newly requested review is unlikely to be ready the next time the user focuses the tab.

    // disable automatic refetching on window focus and let cache invalidation, the cache TTL, or a manual refetch pick up new reviews.

    refetchOnWindowFocus: false,

    // Retry temporary failures (such as brief network issues) before surfacing an error to the UI
    retry: 2,
  });

  return {
    // Always expose an array so consuming components don't need to handle an undefined loading state.

    reviews: reviews || [],
    isLoading,
    error,
    refetch,
  };
};
