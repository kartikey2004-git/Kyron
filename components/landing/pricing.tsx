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

export default function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 lg:px-8">
      <div className="mb-12">
        <span className="inline-flex items-center bg-[#dcfce7] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#047857]">
          Pricing
        </span>
        <h2 className="mt-5 text-[26px] font-medium leading-[0.96] tracking-[-0.05em] text-foreground sm:text-[36px]">
          Free during beta.
          <br />
          Subscription launching soon.
        </h2>
        <p className="mt-4 max-w-lg text-[15px] leading-[1.6] text-muted-foreground">
          Kryon is fully free while in beta. Paid plans are in the works.
        </p>
      </div>

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
              Active now
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

          <a
            href="/login"
            className="mt-8 flex h-10 w-full items-center justify-center bg-foreground text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get started free
          </a>
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
    </section>
  );
}
