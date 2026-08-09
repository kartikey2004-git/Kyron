import { AlertTriangle, Bot, CheckCircle, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";

const diffLines: { line: number; text: string; change?: "add" | "remove" }[] = [
  { line: 24, text: "export const Login = () => {" },
  { line: 25, text: "  const [email, setEmail] = useState('')" },
  {
    line: 26,
    text: "  const [password, setPassword] = useState('')",
    change: "add",
  },
  { line: 27, text: "" },
  {
    line: 28,
    text: "  const handleSubmit = async (e: React.FormEvent) => {",
    change: "add",
  },
  { line: 29, text: "    e.preventDefault()", change: "add" },
  {
    line: 30,
    text: "    const response = await fetch('/api/login', {})",
    change: "remove",
  },
  {
    line: 31,
    text: "    const response = await auth.signIn(email, password)",
    change: "add",
  },
];

const outcomes: { icon: typeof Bot; headline: string; detail: string }[] = [
  { icon: Bot, headline: "AI analyzed", detail: "in 3.2s" },
  { icon: CheckCircle, headline: "3 suggestions", detail: "provided" },
  { icon: AlertTriangle, headline: "1 issue", detail: "found" },
];

export function ReviewMockup() {
  return (
    <div className="mx-auto mt-12 w-full">
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="border-b border-border bg-hairline px-5 py-4 dark:bg-muted">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center rounded-md bg-background">
                <GitPullRequest className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-body-strong text-foreground">
                  feat: Add user authentication
                </h3>
                <p className="text-meta text-muted-foreground">
                  Pull Request #142 • opened 2 hours ago
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-full border border-border px-4 py-2">
              <span className="text-micro-caps uppercase text-slate dark:text-ash">
                AI Reviewed
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-md bg-hairline/60 p-4 font-mono text-sm dark:bg-muted/60">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-medium text-muted-foreground">
                  src/auth/login.ts
                </span>
                <div className="rounded-full border border-border bg-hairline px-3 py-1 dark:bg-muted">
                  <span className="text-xs font-medium">+45 -12</span>
                </div>
              </div>

              <div className="space-y-1">
                {diffLines.map((row) => (
                  <div key={row.line} className="flex whitespace-pre">
                    <span className="w-8 shrink-0 pr-4 text-right text-muted-foreground">
                      {row.line}
                    </span>
                    <span
                      className={
                        row.change === "remove"
                          ? "text-muted-foreground line-through"
                          : row.change === "add"
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }
                    >
                      {row.change === "add"
                        ? "+"
                        : row.change === "remove"
                          ? "-"
                          : " "}
                      {row.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {outcomes.map((outcome) => {
                  const Icon = outcome.icon;

                  return (
                    <div
                      key={outcome.headline}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {outcome.headline}
                        </p>
                        <p className="text-muted-foreground">
                          {outcome.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button size="lg" className="shrink-0">
                View full analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
