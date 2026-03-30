import { useQuery } from "@tanstack/react-query";
import { getConnectedRepositories } from "../actions";

export interface ConnectedRepository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export const useConnectedRepositories = () => {
  return useQuery<ConnectedRepository[]>({
    queryKey: ["connected-repositories"],
    queryFn: async () => {
      const result = await getConnectedRepositories();
      return result.map((repo) => ({
        ...repo,
        createdAt: repo.createdAt.toISOString(),
        updatedAt: repo.updatedAt.toISOString(),
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
