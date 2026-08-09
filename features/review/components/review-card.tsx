"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hlTypescript from "highlight.js/lib/languages/typescript";
import hlJavascript from "highlight.js/lib/languages/javascript";
import hlPython from "highlight.js/lib/languages/python";
import hlGo from "highlight.js/lib/languages/go";
import hlJson from "highlight.js/lib/languages/json";
import hlBash from "highlight.js/lib/languages/bash";
import hlDiff from "highlight.js/lib/languages/diff";
import hlYaml from "highlight.js/lib/languages/yaml";
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

/*

  Displays a single AI generated PR review.
 
    - Short reviews are shown in full, while longer ones are truncated with an option to view the complete markdown which make rendering the content safely and making it easy to read.

*/

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

// Configure syntax highlighting only for the languages this application supports while skipping unused language grammars reduces bundle size without affecting how AI reviews are rendered.

const REHYPE_HIGHLIGHT_OPTIONS = {
  languages: {
    typescript: hlTypescript,
    ts: hlTypescript,
    tsx: hlTypescript,
    javascript: hlJavascript,
    js: hlJavascript,
    jsx: hlJavascript,
    python: hlPython,
    py: hlPython,
    go: hlGo,
    json: hlJson,
    bash: hlBash,
    sh: hlBash,
    diff: hlDiff,
    yaml: hlYaml,
    yml: hlYaml,
  },
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

  // Show only the first ~300 characters in the card. This keeps the preview readable while encouraging longer reviews to be viewed in the full panel.

  const isLong = review.review.length > 300;

  return (
    <>
      <Card className="flex h-full flex-col gap-0 rounded-md border-hairline py-0 transition-colors hover:border-foreground/30 dark:border-white/10">
        <CardHeader className="space-y-2.5 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitPullRequest className="size-3.5 text-stone" />

              <span className="font-mono text-meta tabular-nums text-foreground">
                #{review.prNumber}
              </span>

              <Badge
                variant={STATUS_VARIANT[review.status] ?? "outline"}
                className="rounded-md text-meta"
              >
                {review.status}
              </Badge>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 text-meta text-stone">
              <Clock className="size-3" />
              {formatDate(review.createdAt)}
            </div>
          </div>

          <a
            href={review.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1.5 text-body-strong text-foreground transition-colors hover:text-primary"
          >
            <span className="line-clamp-2">{review.prTitle}</span>

            <ExternalLink className="mt-0.5 size-3 shrink-0 text-stone" />
          </a>

          <p className="truncate font-mono text-meta text-stone">
            {review.repository.owner}/{review.repository.name}
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 space-y-2 px-5 py-4">
          <div className="prose prose-sm line-clamp-6 max-w-none text-muted-foreground dark:prose-invert prose-headings:text-body-strong prose-headings:text-foreground prose-p:leading-[1.6] prose-a:font-normal prose-a:text-foreground prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:rounded prose-code:bg-hairline prose-code:px-1 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal dark:prose-code:bg-white/10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeHighlight, REHYPE_HIGHLIGHT_OPTIONS]]}
            >
              {review.review}
            </ReactMarkdown>
          </div>

          {isLong && (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-7 px-2 text-meta"
              onClick={() => setIsSheetOpen(true)}
            >
              <ChevronDown className="size-3.5" />
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
              border-hairline
              p-4
              dark:border-white/10
            "
          >
            <SheetHeader className="space-y-3 border-b border-hairline pb-4 dark:border-white/10">
              <SheetTitle className="sr-only">Review Details</SheetTitle>
              <SheetDescription className="sr-only">
                Full review content for pull request #{review.prNumber}
              </SheetDescription>
              <div className="flex items-center gap-3">
                <GitPullRequest className="size-4 text-stone" />

                <span className="font-mono text-body tabular-nums">
                  #{review.prNumber}
                </span>

                <Badge variant={STATUS_VARIANT[review.status]}>
                  {review.status}
                </Badge>
              </div>

              <a
                href={review.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 text-heading-sm text-foreground hover:text-primary"
              >
                {review.prTitle}
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-stone" />
              </a>

              <p className="font-mono text-meta text-stone">
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
                prose-li:marker:text-stone
                
                prose-code:text-[13px]
                prose-code:bg-hairline
                dark:prose-code:bg-white/10
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded
                prose-code:font-mono
                
                prose-pre:bg-hairline/60
                prose-pre:border
                prose-pre:border-hairline
                dark:prose-pre:bg-white/5
                dark:prose-pre:border-white/10
                prose-pre:rounded-md
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
                prose-th:bg-hairline/50
                dark:prose-th:bg-white/5
                prose-th:font-semibold
                prose-th:p-2
                prose-td:p-2
                
                prose-blockquote:border-l-2
                prose-blockquote:border-hairline
                prose-blockquote:pl-4
                prose-blockquote:italic
                prose-blockquote:my-4
                
                prose-hr:border-hairline
                prose-hr:my-6
              
                max-h-[calc(100vh-200px)]
                overflow-y-auto
                pr-2
              "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeHighlight, REHYPE_HIGHLIGHT_OPTIONS]]}
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
