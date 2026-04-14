"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Review } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, GitPullRequest, Clock, ChevronDown } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  failed: "destructive",
  pending: "secondary",
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isLong = review.review.length > 300;

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardHeader className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />

              <span className="text-xs font-mono">#{review.prNumber}</span>

              <Badge
                variant={STATUS_VARIANT[review.status] ?? "outline"}
                className="text-[11px]"
              >
                {review.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(review.createdAt)}
            </div>
          </div>

          <a
            href={review.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm hover:text-primary transition-colors flex gap-1"
          >
            <span className="line-clamp-2">{review.prTitle}</span>

            <ExternalLink className="h-3 w-3 mt-0.5 opacity-60" />
          </a>

          <p className="text-xs text-muted-foreground font-mono">
            {review.repository.owner}/{review.repository.name}
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="px-5 py-4 space-y-3 flex-1">
          <div className="prose prose-xs max-w-none dark:prose-invert prose-p:leading-relaxed prose-headings:font-semibold prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline line-clamp-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {review.review}
            </ReactMarkdown>
          </div>

          {isLong && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 -ml-2"
              onClick={() => setIsSheetOpen(true)}
            >
              <ChevronDown className="h-3.5 w-3.5 mr-1" />
              Show more
            </Button>
          )}
        </CardContent>
      </Card>

      {isLong && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="right"
            className="
              h-screen
              w-full
              sm:w-[48vw]
              lg:w-[42vw]
              max-w-none
              overflow-y-auto
              border-l
              p-4
              shadow-2xl
            "
          >
            <SheetHeader className="border-b pb-4 space-y-3">
              <SheetTitle className="sr-only">Review Details</SheetTitle>
              <SheetDescription className="sr-only">
                Full review content for pull request #{review.prNumber}
              </SheetDescription>
              <div className="flex items-center gap-3">
                <GitPullRequest className="h-4 w-4" />

                <span className="font-mono">#{review.prNumber}</span>

                <Badge variant={STATUS_VARIANT[review.status]}>
                  {review.status}
                </Badge>
              </div>

              <a
                href={review.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:text-primary flex gap-2"
              >
                {review.prTitle}
                <ExternalLink className="h-4 w-4" />
              </a>

              <p className="text-sm text-muted-foreground">
                {review.repository.owner}/{review.repository.name}
              </p>
            </SheetHeader>

            <div className="py-6 px-6">
              <div
                className="
                prose
                prose-sm
                max-w-none
                dark:prose-invert
                
                prose-headings:font-semibold
                prose-headings:tracking-tight
                prose-headings:mb-4
                prose-headings:mt-6
                
                prose-p:leading-relaxed
                prose-p:mb-4
                prose-p:mt-0
                
                prose-ul:my-4
                prose-ol:my-4
                prose-li:my-1
                prose-li:marker:text-muted-foreground
                
                prose-code:text-[13px]
                prose-code:bg-muted
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded
                prose-code:font-mono
                
                prose-pre:bg-muted
                prose-pre:border
                prose-pre:rounded-lg
                prose-pre:p-4
                prose-pre:overflow-x-auto
                prose-pre:whitespace-pre-wrap
                
                prose-strong:text-foreground
                prose-em:text-foreground/80
                
                prose-a:text-primary
                prose-a:no-underline
                hover:prose-a:underline
                prose-a:font-medium
                
                prose-table:border
                prose-th:border
                prose-td:border
                prose-th:bg-muted/50
                prose-th:font-semibold
                prose-th:p-2
                prose-td:p-2
                
                prose-blockquote:border-l-2
                prose-blockquote:border-muted-foreground
                prose-blockquote:pl-4
                prose-blockquote:italic
                prose-blockquote:my-4
                
                prose-hr:border-border
                prose-hr:my-6
              
                max-h-[calc(100vh-200px)]
                overflow-y-auto
                pr-2
              "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {review.review}
                </ReactMarkdown>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
