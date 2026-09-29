import { Check, Zap } from "lucide-react";

const FREE_FEATURES = [
  "1 connected repository",
  "AI review on every pull request",
  "Full repo indexing and retrieval",
  "Walkthrough, risks and suggestions",
  "Sequence diagrams on non-trivial changes",
  "Review history dashboard",
  "Encrypted token storage",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Up to 10 connected repositories",
  "Priority review queue",
  "Team dashboard",
  "Email digest of review activity",
  "Early access to new features",
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h1 className="mt-1 text-[22px] font-medium tracking-[-0.04em] text-foreground">
          Subscription
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Kryon is free during beta. Paid plans are coming soon.
        </p>
      </div>

      {/* Current plan banner */}
      <div className="flex items-center gap-3 border border-border bg-card px-5 py-4">
        <span className="inline-flex items-center gap-1.5 bg-[#dcfce7] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#047857]">
          <Zap className="size-3" />
          Active
        </span>
        <p className="text-[13px] text-foreground">
          You are on the <span className="font-medium">Free</span> plan.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        {/* Free tier */}
        <div className="bg-card p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Free
              </p>
              <p className="mt-2 text-[32px] font-medium tracking-[-0.04em] text-foreground leading-none">
                $0
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                No card required, no time limit.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#dcfce7] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#047857]">
              <Zap className="size-3" />
              Current plan
            </span>
          </div>

          <ul className="mt-8 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Check className="mt-0.5 size-3.5 shrink-0 text-[#047857]" />
                <span className="text-[13px] text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex h-10 w-full items-center justify-center border border-border bg-muted/30">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Already active
            </span>
          </div>
        </div>

        {/* Pro tier: coming soon */}
        <div className="relative bg-card p-5 opacity-70 sm:p-8">
          <div className="absolute right-4 top-4">
            <span className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Coming soon
            </span>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Pro
            </p>
            <p className="mt-2 text-[32px] font-medium tracking-[-0.04em] text-foreground leading-none">
              TBD
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Per month, billed annually.
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Check className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
                <span className="text-[13px] text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 h-10 w-full border border-dashed border-border flex items-center justify-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Not yet available
            </span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[12px] text-muted-foreground">
        Pricing and billing details will be announced before launch. No action needed.
      </p>
    </div>
  );
}
