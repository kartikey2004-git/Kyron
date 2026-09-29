"use client";

import React from "react";
import { useReviews } from "@/modules/review/hooks/use-reviews";
import { ReviewList } from "@/modules/review/components/review-list";
import { ReviewSkeleton } from "@/modules/review/components/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReviewsPage: React.FC = () => {
  const { reviews, isLoading, error, refetch } = useReviews();

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          History
        </p>
        <h1 className="mt-1 text-[22px] font-medium tracking-[-0.04em] text-foreground">
          Code Reviews
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          All AI-powered reviews Kryon has posted on your pull requests.
        </p>
      </div>

      {isLoading ? (
        <ReviewSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>Failed to load reviews. Please try again.</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </div>
  );
};

export default ReviewsPage;
