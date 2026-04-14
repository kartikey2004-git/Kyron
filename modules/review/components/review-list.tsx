"use client";

import React from "react";
import { Review } from "../types";
import { ReviewCard } from "./review-card";
import { Bot } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/30">
        <Bot className="h-8 w-8 text-muted-foreground mb-3" />

        <h3 className="text-sm font-semibold">No reviews yet</h3>

        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          Your code reviews will appear here once you start analyzing pull
          requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
