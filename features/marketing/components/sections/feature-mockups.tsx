import { Bot, GitPullRequest, MessageSquare, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeatureMockup } from "../data";

function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn(className)}>{children}</div>;
}

function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-2 rounded-full bg-hairline dark:bg-white/10",
        className
      )}
    />
  );
}

function RetrievalMockup() {
  const chunks = [
    { path: "lib/auth/session.ts", score: "0.91" },
    { path: "modules/github/webhook.ts", score: "0.87" },
    { path: "lib/db/queries.ts", score: "0.82" },
  ];

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-3.5 py-2.5 dark:border-white/10">
        <span className="text-xs font-medium text-foreground">
          Retrieved context
        </span>
        <span className="px-2 py-0.5 text-xs text-stone">15 chunks</span>
      </div>

      <div className="divide-y divide-hairline dark:divide-white/10">
        {chunks.map((chunk, index) => (
          <div
            key={chunk.path}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5"
          >
            <span className="truncate font-mono text-xs text-stone">
              {chunk.path}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs",
                index === 0 ? "text-brand-accent" : "text-stone"
              )}
            >
              {chunk.score}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ReviewMockupPanel() {
  return (
    <Panel className="p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-brand-accent/12">
          <Bot className="size-3.5 text-brand-accent" />
        </span>
        <span className="text-xs font-medium text-foreground">
          Kryon reviewed this pull request
        </span>
      </div>

      <div className="mt-3.5 space-y-3">
        {["Walkthrough", "Issues", "Suggestions"].map((heading, index) => (
          <div key={heading}>
            <span className="text-xs font-medium text-foreground">
              {heading}
            </span>
            <div className="mt-2 space-y-1.5">
              <Bar className="w-full" />
              <Bar className={index === 1 ? "w-2/3" : "w-4/5"} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FlowMockup() {
  const triggers = ["opened", "synchronize", "reopened"];
  const outputs = [
    { icon: MessageSquare, label: "Pull request comment" },
    { icon: RefreshCw, label: "Review history" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:gap-6">
      <div className="flex w-full max-w-xs flex-col gap-2 lg:w-auto">
        {triggers.map((trigger) => (
          <Panel
            key={trigger}
            className="flex items-center gap-2.5 px-3.5 py-2.5"
          >
            <GitPullRequest className="size-3.5 shrink-0 text-stone" />
            <span className="font-mono text-xs text-stone">{trigger}</span>
          </Panel>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="h-6 w-px bg-hairline lg:h-px lg:w-10 dark:bg-white/10"
      />

      <Panel className="flex items-center gap-2.5 px-3.5 py-2.5">
        <span className="size-2 shrink-0 rounded-full bg-brand-accent" />
        <span className="text-xs font-medium text-foreground">Kryon</span>
        <span className="rounded-full bg-brand-accent/12 px-2 py-0.5 text-xs text-brand-accent">
          reviewing
        </span>
      </Panel>

      <span
        aria-hidden="true"
        className="h-6 w-px bg-hairline lg:h-px lg:w-10 dark:bg-white/10"
      />

      <div className="flex w-full max-w-xs flex-col gap-2 lg:w-auto">
        {outputs.map((output) => {
          const Icon = output.icon;

          return (
            <Panel
              key={output.label}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
            >
              <Icon className="size-3.5 shrink-0 text-stone" />
              <span className="text-xs text-stone">{output.label}</span>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

export function FeatureMockupPanel({ mockup }: { mockup: FeatureMockup }) {
  if (mockup === "retrieval") return <RetrievalMockup />;
  if (mockup === "review") return <ReviewMockupPanel />;
  return <FlowMockup />;
}
