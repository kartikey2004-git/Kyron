"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserRepositories } from "../actions";

export const useRepositories = () => {
  return useInfiniteQuery({
    queryKey: ["repositories"],
    queryFn: async ({ pageParam }) => {
      const data = await fetchUserRepositories(pageParam, 10);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
