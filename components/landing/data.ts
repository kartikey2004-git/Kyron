/* eslint-disable @typescript-eslint/no-explicit-any */

import { NavigationSection } from "@/types/navigation";
import {
  BookOpen,
  Bot,
  CheckCircle,
  Code,
  Code2,
  CreditCard,
  GitBranch,
  MessageSquare,
  Settings,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";

export const features = [
  {
    icon: Bot,
    title: "Instant PR Summaries",
    description:
      "Kryon reads every diff and generates a summary in seconds: what changed, why it matters, and what to watch out for.",
    badge: "Popular",
  },
  {
    icon: MessageSquare,
    title: "Line-by-Line Suggestions",
    description:
      "Get targeted, actionable suggestions pinned to the exact lines that need attention. Not generic advice, but fixes you can apply immediately.",
    badge: null,
  },
  {
    icon: Shield,
    title: "Security Vulnerability Scan",
    description:
      "Catches common security pitfalls (exposed secrets, injection risks, unsafe dependencies) before your PR ever merges to main.",
    badge: "Critical",
  },
  {
    icon: Zap,
    title: "Auto-Generated Comments",
    description:
      "Kryon posts review comments directly on your PR with context, rationale, and a suggested fix, so reviewers start informed, not from scratch.",
    badge: null,
  },
  {
    icon: GitBranch,
    title: "Multi-Language Support",
    description:
      "Works across TypeScript, JavaScript, Python, Go, and more. Kryon adapts its analysis to the idioms and best practices of each language.",
    badge: "Popular",
  },
  {
    icon: Code2,
    title: "Code Quality Scoring",
    description:
      "Each PR gets a quality score with a breakdown of readability, complexity, test coverage hints, and adherence to project conventions.",
    badge: null,
  },
];

export const steps = [
  {
    icon: FiGithub as any,
    title: "Connect your GitHub repo",
    description:
      "Sign in with GitHub, select the repositories you want reviewed, and grant Kryon read access. Done in under 60 seconds.",
  },
  {
    icon: Code,
    title: "Open any pull request",
    description:
      "Push a branch and open a PR as you normally would. Kryon picks it up automatically, no extra commands or webhooks to configure.",
  },
  {
    icon: CheckCircle,
    title: "Review in seconds, not hours",
    description:
      "Kryon posts a full AI review on your PR: a summary, inline suggestions, a security scan, and a quality score. All before your first human reviewer arrives.",
  },
];

export const plans = [
  {
    name: "Free",
    description: "Everything you need to get started",
    price: "$0",
    period: "/month",
    features: [
      "10 PR reviews per month",
      "AI summaries & inline suggestions",
      "Security vulnerability scan",
      "Public repositories",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For developers who ship every day",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited PR reviews",
      "Private repositories",
      "Code quality scoring",
      "Multi-language deep analysis",
      "Priority support",
      "Custom review rules",
    ],
    highlighted: true,
  },
];

export const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Documentation", href: "/docs" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
};

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/kartikey2004-git/Kyron",
    icon: FiGithub as any,
  },
  { name: "Twitter", href: "https://x.com/kartikeybuilds", icon: X },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kartikey-bhatnagar-2702a4337",
    icon: FaLinkedinIn,
  },
];

export const navigationConfig: NavigationSection[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: BookOpen,
      },
      {
        title: "Repository",
        url: "/dashboard/repository",
        icon: FiGithub as any,
      },
      {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        title: "Subscription",
        url: "/dashboard/subscription",
        icon: CreditCard,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
