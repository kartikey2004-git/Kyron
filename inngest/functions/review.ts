/* eslint-disable @typescript-eslint/no-explicit-any */

import { inngest } from "@/inngest/client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { getLogger } from "@/lib/logger";
import { withRequestContext } from "@/lib/request-context";
import { invalidatePattern } from "@/lib/cache";
import { reviewGenerationDuration } from "@/lib/metrics";
import { withSpan } from "@/lib/tracing";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/modules/github/lib/github";
import { retrieveContext } from "@/modules/ai/lib/retrieve-context";

const REVIEW_MODEL = "gemini-2.5-flash";

export const generateReview = inngest.createFunction(
  {
    id: "generate-review",
    concurrency: 5,
    triggers: { event: "pr.review.requested" },
  },

  async ({ event, step }: { event: any; step: any }) => {
    return withRequestContext(
      () => runGenerateReview({ event, step }),
      { requestId: event.id }
    );
  }
);

async function runGenerateReview({
  event,
  step,
}: {
  event: any;
  step: any;
}) {
  const { owner, repo, prNumber, userId } = event.data;
  const logger = getLogger({ fn: "generateReview", owner, repo, prNumber });
  const stopTimer = reviewGenerationDuration.startTimer();

  return withSpan(
    "inngest.generateReview",
    async () => {
      try {
        logger.info("starting review generation");

        const { diff, title, description, token } = await step.run(
          "fetch-pr-data",
          () =>
            withSpan("fetch-pr-data", async () => {
              const account = await prisma.account.findFirst({
                where: { userId: userId, providerId: "github" },
              });

              if (!account?.accessToken) {
                throw new Error("GitHub access token not found");
              }

              const data = await getPullRequestDiff(
                account.accessToken,
                owner,
                repo,
                prNumber
              );

              return { ...data, token: account.accessToken };
            })
        );

        const repository = await step.run("find-repository", () =>
          withSpan("find-repository", async () => {
            const repository = await prisma.repository.findFirst({
              where: {
                owner,
                name: repo,
              },
            });

            if (!repository) {
              throw new Error("Repository not found");
            }

            return repository;
          })
        );

        const context = await step.run(
          "retrieve-context",
          () =>
            withSpan("retrieve-context", async () => {
              const query = `
PR Title:
${title}

PR Description:
${description ?? ""}

Diff:
${diff}
`;
              return retrieveContext(query, repository.id, 15);
            }),
          {
            retries: 3,
            retryDelay: 1000,
          }
        );

        logger.info(
          { contextChunks: context.length },
          "retrieved review context"
        );

        const formattedContext =
          context.length > 0
            ? context
                .map(
                  (chunk: any) => `
            FILE:
            ${chunk.filePath}
            ${chunk.content}`
                )
                .join("\n\n")
            : "No relevant code context found.";

        const review = await step.run("generate-ai-review", () =>
          withSpan(
            "generate-ai-review",
            async () => {
              const model = google(REVIEW_MODEL);

              const prompt = `
You are an expert code reviewer.

Analyze the following pull request and provide a structured, high-quality review.

======================
PR TITLE
======================
${title}

PR DESCRIPTION
======================
${description || "No description provided"}

RELATED CODE CONTEXT
=====================
${formattedContext}

======================
CODE CHANGES
======================
\`\`\`diff
${diff}
\`\`\`

======================
PLEASE PROVIDE:
======================

1. **Walkthrough**:
A clear, file-by-file explanation of the changes. Explain what was modified and why it matters.

2. **Sequence Diagram**:
A Mermaid JS sequence diagram showing the flow of the changes (if applicable).

IMPORTANT:
- Use \`\`\`mermaid ... \`\`\` block
- Ensure Mermaid syntax is valid
- Avoid special characters (quotes, {}, (), etc.) in labels or notes
- Keep the diagram simple and readable

3. **Summary**:
A brief overview of what this PR does.

4. **Strengths**:
What is done well in this PR (good practices, clean code, design decisions).

5. **Issues**:
- Bugs or potential bugs
- Security concerns
- Performance issues
- Code smells

6. **Suggestions**:
Specific, actionable improvements (refactoring, naming, structure, optimizations).

7. **Edge Cases / Testing**:
Mention missing test cases or important edge cases to consider.

======================
RESPONSE FORMAT:
======================
- Use clear headings
- Use bullet points
- Be precise and avoid generic feedback
- Focus on practical improvements
`;

              const review = await withSpan(
                "gemini.generateText",
                () => generateText({ model, prompt }),
                { "gemini.model": REVIEW_MODEL }
              );

              return review.text;
            }
          )
        );

        await step.run("post-comment", () =>
          withSpan("post-comment", () =>
            postReviewComment(token, owner, repo, prNumber, review)
          )
        );

        await step.run("save-review", () =>
          withSpan("save-review", async () => {
            const repository = await prisma.repository.findFirst({
              where: {
                owner,
                name: repo,
              },
            });

            if (!repository) {
              throw new Error("Repository not found");
            }

            if (repository) {
              await prisma.review.create({
                data: {
                  repositoryId: repository.id,
                  prNumber,
                  prTitle: title,
                  prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
                  review,
                  status: "completed",
                },
              });

              // The dashboard's review count/list just changed under it —
              // this is the only write path for reviews (there's no
              // review-creating server action), so this is where it must
              // be invalidated.
              await invalidatePattern(`dash:${userId}:*`);
            }
          })
        );

        logger.info("review generation completed");
        return { success: true };
      } catch (error) {
        logger.error(
          { err: error instanceof Error ? error.message : String(error) },
          "review generation failed"
        );
        throw error;
      } finally {
        stopTimer();
      }
    },
    { "github.owner": owner, "github.repo": repo, "github.pr_number": prNumber }
  );
}
