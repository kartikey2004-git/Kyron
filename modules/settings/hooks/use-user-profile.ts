import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../actions";

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
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - cache for 5 minutes

    refetchOnWindowFocus: false, // Don't refetch when window regains focus - user data doesn't change frequently
  });
};
