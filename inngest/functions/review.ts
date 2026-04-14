import { inngest } from "@/inngest/client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { retrieveContext } from "@/modules/ai/lib/rag";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/modules/github/lib/github";

export const generateReview = inngest.createFunction(
  {
    id: "generate-review",
    concurrency: 5,
    triggers: { event: "pr.review.requested" },
  },

  async ({ event, step }: { event: any; step: any }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
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
          prNumber,
        );

        return { ...data, token: account.accessToken };
      },
    );

    const context = await step.run(
      "retrieve-context",
      async () => {
        const query = `title: ${title}\n${description}`;

        const result = await retrieveContext(query, `${owner}/${repo}`);
        
        return result;
      },
      {
        retries: 3,
        retryDelay: 1000,
      },
    );

    const review = await step.run("generate-ai-review", async () => {
      const model = google("gemini-2.5-flash");

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

======================
CONTEXT FROM CODEBASE
======================
${context.join("\n\n")}

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

      const review = await generateText({
        model,
        prompt,
      });

      return review.text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(token, owner, repo, prNumber, review);
    });

    await step.run("save-review", async () => {
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
      }
    });

    return { success: true };
  },
);
