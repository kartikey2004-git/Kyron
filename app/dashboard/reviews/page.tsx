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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto -mt-10 py-8">
          <h1 className="text-3xl font-bold tracking-tight">Code Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all your AI-powered code reviews
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <ReviewSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>Failed to load reviews. Please try again later.</div>
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
    </div>
  );
};

export default ReviewsPage;
