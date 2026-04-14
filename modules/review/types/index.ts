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
