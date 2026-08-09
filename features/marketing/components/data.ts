import { IconComponent } from "@/types/navigation";
import {
  Activity,
  Bot,
  Code2,
  Coins,
  GaugeCircle,
  GitBranch,
  GitFork,
  GitMerge,
  GraduationCap,
  KeyRound,
  Layers,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SignalHigh,
  Timer,
  User,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const siteLinks = {
  docs: "https://kyrondevdocs.vercel.app",
  github: "https://github.com/kartikey2004-git/AI-Code-Review",
  twitter: "https://x.com/kartikeybuilds",
  linkedin: "https://linkedin.com/in/kartikey-bhatnagar-2702a4337",
} as const;

export const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: siteLinks.docs, external: true },
];

export const steps: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: FiGithub,
    title: "Connect GitHub",
    description:
      "Sign in with GitHub and pick a repository. Kryon registers a webhook and starts indexing — no CLI, no config file, no CI changes.",
  },
  {
    icon: Code2,
    title: "Open a pull request",
    description:
      "Work exactly as you do now. Opening, reopening, or pushing to a PR triggers a review automatically.",
  },
  {
    icon: MessageSquare,
    title: "Get a structured review",
    description:
      "A full review lands as a PR comment: walkthrough, sequence diagram, risks, and suggestions — and is saved to your dashboard.",
  },
];

export type FeatureMockup = "retrieval" | "review" | "flow";

export const features: {
  icon: IconComponent;
  title: string;
  description: string;
  layout: "half" | "full" | "third";
  mockup?: FeatureMockup;
}[] = [
  {
    icon: GitBranch,
    title: "Repository-aware context",
    description:
      "Kryon pulls the most relevant functions and classes from your repo and reviews the diff against them.",
    layout: "half",
    mockup: "retrieval",
  },
  {
    icon: Bot,
    title: "Structured PR walkthroughs",
    description:
      "A file-by-file account of what changed and why, for a reviewer who hasn't seen the branch.",
    layout: "half",
    mockup: "review",
  },
  {
    icon: Zap,
    title: "Automatic on every PR",
    description:
      "Opened, reopened and updated pull requests are picked up by webhook. Nothing to run.",
    layout: "full",
    mockup: "flow",
  },
  {
    icon: Shield,
    title: "Risk and security review",
    description:
      "Bugs, security concerns, performance problems and code smells, in their own section.",
    layout: "third",
  },
  {
    icon: MessageSquare,
    title: "Actionable suggestions",
    description:
      "Specific refactors, naming and structural fixes — not advice to add tests.",
    layout: "third",
  },
  {
    icon: Code2,
    title: "Sequence diagrams",
    description:
      "Non-trivial changes come with a Mermaid sequence diagram of the new flow.",
    layout: "third",
  },
];

export const pipelineSteps: {
  step: string;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    title: "AST-aware chunking",
    description:
      "Tree-sitter splits files on real boundaries — functions, methods, classes — so every chunk is a complete unit of logic. Covers TypeScript, JavaScript, Python and Go.",
  },
  {
    step: "02",
    title: "Vector embedding",
    description:
      "Each chunk is embedded with Gemini at 768 dimensions and stored in Postgres via pgvector, behind an HNSW index.",
  },
  {
    step: "03",
    title: "Incremental re-indexing",
    description:
      "Kryon records the last indexed commit and re-fetches only what changed — no clone, no git binary.",
  },
  {
    step: "04",
    title: "Retrieval",
    description:
      "A pull request's title, description and diff become the query. The fifteen closest chunks come back as grounding context.",
  },
  {
    step: "05",
    title: "Review generation",
    description:
      "Gemini 2.5 Flash writes the review under a fixed prompt budget, then it's validated, posted to the PR, and saved.",
  },
];

export const durabilityNotes: string[] = [
  "Each stage is a retried step, so a transient failure doesn't lose the run.",
  "Reviews for the same pull request queue rather than race.",
  "Repeat webhook deliveries are de-duplicated by delivery ID.",
];

export const useCases: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: User,
    title: "Solo maintainers",
    description:
      "A second opinion on your own work when there's nobody else to ask.",
  },
  {
    icon: Users,
    title: "Small teams",
    description: "Cut the wait for a first reviewer from hours to seconds.",
  },
  {
    icon: GitFork,
    title: "Open source",
    description:
      "Drive-by contributors get feedback before a maintainer picks it up.",
  },
  {
    icon: GraduationCap,
    title: "Onboarding",
    description: "New contributors get their own change explained in context.",
  },
  {
    icon: Layers,
    title: "Large diffs",
    description:
      "A walkthrough and sequence diagram make a forty-file PR reviewable.",
  },
  {
    icon: ShieldAlert,
    title: "Security-sensitive repos",
    description: "Every review includes an explicit risk pass over the change.",
  },
];

export const benefits: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: Timer,
    title: "Reviewed before you switch tasks",
    description:
      "Reviews run asynchronously and land while the branch is still fresh.",
  },
  {
    icon: RefreshCw,
    title: "Only what changed gets re-indexed",
    description:
      "The second index costs a fraction of the first — changed files only.",
  },
  {
    icon: Workflow,
    title: "Nothing added to CI",
    description:
      "Webhook-driven. No new pipeline step, no minutes on your runner.",
  },
  {
    icon: RotateCcw,
    title: "Failures retry themselves",
    description:
      "A slow model call or a GitHub blip resolves instead of dropping the run.",
  },
  {
    icon: GitMerge,
    title: "Never two reviews at once",
    description:
      "Runs for the same pull request queue, and repeat deliveries are dropped.",
  },
  {
    icon: Coins,
    title: "Bounded cost per review",
    description:
      "Fixed prompt budgets cap every call, and identical chunks embed once.",
  },
];

export const engineeringPoints: {
  icon: IconComponent;
  label: string;
  description: string;
}[] = [
  {
    icon: SignalHigh,
    label: "Observability",
    description:
      "Structured logs, OpenTelemetry traces and Prometheus metrics, correlated in Grafana.",
  },
  {
    icon: GaugeCircle,
    label: "Graceful degradation",
    description:
      "Redis is a cache, not a dependency. If it drops, requests fall through and keep serving.",
  },
  {
    icon: Activity,
    label: "Tested under load",
    description:
      "k6 load, smoke and stress suites, plus chaos runs that kill Postgres and Redis mid-test.",
  },
  {
    icon: RotateCcw,
    label: "Automated rollback",
    description:
      "CI smoke-tests each candidate image against the full stack, then promotes or rolls back.",
  },
];

export const securityPoints: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: KeyRound,
    title: "Tokens encrypted at rest",
    description:
      "Encrypted with AES-256-GCM before they reach the database, under a key kept separate from the session secret.",
  },
  {
    icon: ShieldCheck,
    title: "Verified webhooks",
    description:
      "Every delivery is checked against an HMAC-SHA256 signature over the raw body before a field is read.",
  },
  {
    icon: Timer,
    title: "Rate limited end to end",
    description:
      "Webhook, authentication and job endpoints each carry their own Redis-backed limit.",
  },
  {
    icon: Shield,
    title: "Hardened headers",
    description:
      "HSTS, a strict CSP, X-Frame-Options DENY, nosniff and a locked-down Permissions-Policy.",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What does Kryon actually do?",
    answer:
      "It posts an AI review on every pull request — walkthrough, summary, strengths, risks, suggestions and testing notes — as a comment, saved to your dashboard.",
  },
  {
    question: "How is this different from pasting a diff into a chatbot?",
    answer:
      "Kryon indexes your whole repository first, then reviews each change against the code it retrieves — so the feedback reflects how your codebase works.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Reviews run on any language. Deep indexing — the part supplying surrounding context — covers TypeScript, TSX, JavaScript, JSX, Python and Go.",
  },
  {
    question: "How long does a review take?",
    answer:
      "Usually within seconds of the pull request opening. Very large diffs are truncated to a fixed budget rather than rejected.",
  },
  {
    question: "Does it comment on the PR or just the dashboard?",
    answer:
      "Both — posted as a pull request comment and stored in your review history.",
  },
  {
    question: "What happens when I push more commits?",
    answer:
      "Pushing triggers a fresh review. Runs for the same PR queue rather than race, and duplicate deliveries are ignored.",
  },
  {
    question: "What access does Kryon need?",
    answer:
      "GitHub OAuth with repo scope, to read private pull requests and post comments. Tokens are encrypted at rest; disconnecting a repo removes its webhook.",
  },
  {
    question: "Can I self-host it?",
    answer:
      "Yes. The repo ships a Dockerfile and a full docker-compose stack — app, Postgres with pgvector, Redis, Inngest and observability.",
  },
];

export const plans: {
  name: string;
  audience: string;
  repositories: string;
  unit: string;
  cta: string;
  recommended: boolean;
  features: string[];
}[] = [
  {
    name: "Free",
    audience: "Trying Kryon on one project",
    repositories: "1",
    unit: "repository",
    cta: "Get started",
    recommended: false,
    features: [
      "1 connected repository",
      "Automatic review on every pull request",
      "Full repository indexing and retrieval",
      "Walkthrough, risks and suggestions",
      "Sequence diagrams",
      "Review history dashboard",
      "Encrypted token storage",
    ],
  },
  {
    name: "Pro",
    audience: "Working across several repos",
    repositories: "5",
    unit: "repositories",
    cta: "Get started",
    recommended: true,
    features: [
      "5 connected repositories",
      "Automatic review on every pull request",
      "Full repository indexing and retrieval",
      "Walkthrough, risks and suggestions",
      "Sequence diagrams",
      "Review history dashboard",
      "Encrypted token storage",
    ],
  },
  {
    name: "Enterprise",
    audience: "Teams and organisations",
    repositories: "50",
    unit: "repositories",
    cta: "Contact",
    recommended: false,
    features: [
      "50 connected repositories",
      "Automatic review on every pull request",
      "Full repository indexing and retrieval",
      "Walkthrough, risks and suggestions",
      "Sequence diagrams",
      "Review history dashboard",
      "Encrypted token storage",
      "Self-host with no repository limit",
    ],
  },
];

export const includedInEveryPlan: string[] = [
  "Automatic review on open, reopen, and push",
  "Full repository indexing and retrieval",
  "Walkthrough, risks, suggestions, and sequence diagrams",
  "Review history dashboard",
  "Pull request comment posting",
  "Encrypted token storage",
];

export const stackItems: { label: string; description: string }[] = [
  {
    label: "Next.js 16 · React 19",
    description: "App Router, server actions, and a typed end-to-end surface.",
  },
  {
    label: "Postgres · pgvector",
    description: "Semantic retrieval over an HNSW-indexed code map.",
  },
  {
    label: "Inngest",
    description:
      "Durable background jobs with step-level retries and concurrency keys.",
  },
  {
    label: "Google Gemini",
    description: "Embeddings and review generation through the AI SDK.",
  },
  {
    label: "Redis",
    description:
      "Cache-aside reads that degrade gracefully when the cache is gone.",
  },
  {
    label: "OpenTelemetry · Grafana",
    description:
      "Traces, metrics, and logs correlated across Tempo, Prometheus, and Loki.",
  },
];

export const designPrinciples: { title: string; description: string }[] = [
  {
    title: "Grounded, not generic",
    description:
      "A review that can't cite your codebase is just a style guide. Every review is built on retrieved context from the repository it's reviewing.",
  },
  {
    title: "Durable by default",
    description:
      "Steps retry, runs serialise, deliveries de-duplicate. The interesting failures in this system are all partial ones, so they're designed for first.",
  },
  {
    title: "Legible under pressure",
    description:
      "Structured logs, distributed traces, and metrics from day one — because the time to add observability is before you need it.",
  },
];

export const footerNav: {
  title: string;
  links: { name: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "How it works", href: "/#how-it-works" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: siteLinks.docs, external: true },
      { name: "Source code", href: siteLinks.github, external: true },
      {
        name: "Report an issue",
        href: `${siteLinks.github}/issues`,
        external: true,
      },
      { name: "Sign in", href: "/login" },
    ],
  },
];

export const socialLinks: {
  name: string;
  href: string;
  icon: IconComponent;
}[] = [
  { name: "GitHub", href: siteLinks.github, icon: FiGithub },
  { name: "X / Twitter", href: siteLinks.twitter, icon: FaXTwitter },
  { name: "LinkedIn", href: siteLinks.linkedin, icon: FaLinkedinIn },
];
