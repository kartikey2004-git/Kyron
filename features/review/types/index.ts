/*
 
  - Shared type for review data used by client components which mirrors the shape returned by the backend, including the associated repository information. 
  
  - The type is defined separately from Prisma so it can be safely imported on both the client and server.

*/

export interface Review {
  id: string;
  repositoryId: string;
  repository: {
    id: string;
    name: string;
    owner: string;
    fullName: string;
    url: string;
    githubId: bigint;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  prNumber: number;
  prTitle: string;
  prUrl: string;
  review: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  reviews: Review[];
}
