"use client";

import React from "react";
import { Review } from "../types";
import { ReviewCard } from "./review-card";
import { Bot } from "lucide-react";

/*
  
  Displays the user's AI review history.
  
   - rendering the review list or an empty state when no reviews exist. Loading is handled separately so users can clearly distinguish between "no reviews yet" and "still loading."

*/

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-hairline py-24 text-center dark:border-white/10">
        <Bot className="size-8 text-stone" />

        <h3 className="text-heading-sm text-foreground">No reviews yet</h3>

        <p className="max-w-sm text-body text-muted-foreground">
          Connect a repository and open a pull request. The review lands here
          and on the PR itself.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
