"use client";

import { useQuery } from "@tanstack/react-query";
import { Review } from "../types";
import { getReviews } from "../actions";

export const useReviews = () => {
  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => await getReviews(),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    reviews: reviews || [],
    isLoading,
    error,
    refetch,
  };
};
