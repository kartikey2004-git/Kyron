import { Search, Sparkles, RefreshCw, Shield, Layers } from "lucide-react";

export type Faq = {
  question: string;
  answer: string;
};

export type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
  accent?: boolean;
};

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = {
  heading: string;
  links: NavLink[];
};

export const nav: NavItem[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/login" },
    ],
  },
];

export const faqs: Faq[] = [
  {
    question: "What exactly does Kryon review?",
    answer:
      "Kryon reads the full diff of every pull request (every added, changed, and removed line) and produces summary, inline suggestions, a security vulnerability scan, and a quality score, all posted directly on the PR.",
  },
  {
    question: "Which programming languages are supported?",
    answer:
      "TypeScript, JavaScript, Python, and Go are fully supported today, with more languages being added. Kryon adapts its analysis to the idioms and best practices of each language rather than applying generic rules.",
  },
  {
    question: "Does it work with private repositories?",
    answer:
      "Yes. Kryon connects via GitHub OAuth and works with both public and private repositories. Your code never leaves GitHub. Kryon reads only the diff it needs to perform the review.",
  },
  {
    question: "How is this different from GitHub Copilot or linters?",
    answer:
      "Linters check syntax rules. Copilot suggests completions as you type. Kryon reviews the complete change in context. It understands what the PR is trying to do, finds issues with the logic and security, and explains its reasoning like a senior engineer would.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign in with GitHub, connect the repository you want reviewed, and open any pull request. Kryon picks it up automatically. No webhooks to configure, no YAML to write.",
  },
];

export const leftFeatures: Feature[] = [
  {
    title: "INSTANT PR SUMMARIES",
    description:
      "Kryon reads the full diff and generates summary of what changed, why it matters, and what to watch out for, before any human reviewer arrives.",
    icon: Sparkles,
    accent: true,
  },
  {
    title: "SECURITY VULNERABILITY SCAN",
    description:
      "Catches exposed secrets, injection risks, unsafe dependencies, and other common security pitfalls in every PR, automatically.",
    icon: Shield,
  },
  {
    title: "MULTI-LANGUAGE ANALYSIS",
    description:
      "TypeScript, JavaScript, Python, Go. Kryon adapts its analysis to the idioms and best practices of each language, not just generic rules.",
    icon: Search,
  },
];

export const rightFeatures: Feature[] = [
  {
    title: "CODE QUALITY SCORING",
    description:
      "Each PR receives a quality score with a breakdown of readability, complexity, and test coverage hints so reviewers start with a clear picture.",
    icon: RefreshCw,
  },
  {
    title: "AUTO-POSTED REVIEW COMMENTS",
    description:
      "Suggestions are posted as inline comments directly on the PR, with context, rationale, and a proposed fix. Not buried in a separate dashboard.",
    icon: Layers,
  },
];
