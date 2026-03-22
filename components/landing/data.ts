import { NavigationSection } from "@/types/navigation";
import {
  BookOpen,
  Bot,
  CheckCircle,
  Code,
  Code2,
  CreditCard,
  GitBranch,
  Github,
  Linkedin,
  MessageSquare,
  Settings,
  Shield,
  Twitter,
  Zap,
} from "lucide-react";

export const features = [
  {
    icon: Bot,
    title: "AI PR Summaries",
    description:
      "Get instant, intelligent summaries of pull requests to understand changes at a glance.",
    badge: "Popular",
  },
  {
    icon: MessageSquare,
    title: "Inline Suggestions",
    description:
      "Receive contextual code suggestions directly in your pull requests for better implementations.",
    badge: null,
  },
  {
    icon: Shield,
    title: "Security Detection",
    description:
      "Automatically identify security vulnerabilities and potential issues before they reach production.",
    badge: "Enterprise",
  },
  {
    icon: Zap,
    title: "Auto Comments",
    description:
      "AI automatically adds meaningful comments explaining complex code changes and improvements.",
    badge: null,
  },
  {
    icon: GitBranch,
    title: "Faster Reviews",
    description:
      "Reduce review time by 80% with AI-powered analysis that catches issues humans might miss.",
    badge: "Popular",
  },
  {
    icon: Code2,
    title: "Code Quality",
    description:
      "Ensure consistent code quality with automated checks for best practices and standards.",
    badge: null,
  },
];

export const steps = [
  {
    icon: GitBranch,
    title: "Connect GitHub",
    description:
      "Install our GitHub app in seconds. No complex setup required.",
  },
  {
    icon: Code,
    title: "Open a Pull Request",
    description:
      "Create a PR as usual. Our AI automatically analyzes every change.",
  },
  {
    icon: CheckCircle,
    title: "Get AI Reviews",
    description:
      "Receive instant feedback, suggestions, and automated comments.",
  },
];

export const plans = [
  {
    name: "Free",
    description: "Perfect for individual developers",
    price: "$0",
    period: "/month",
    features: [
      "5 PR reviews per month",
      "Basic AI suggestions",
      "Public repositories only",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For professional developers",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited PR reviews",
      "Advanced AI analysis",
      "Private repositories",
      "Priority support",
      "Custom rules",
      "Team collaboration",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    description: "For growing teams",
    price: "$99",
    period: "/month",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced analytics",
      "SSO authentication",
      "Dedicated support",
      "Custom integrations",
    ],
    highlighted: false,
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
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
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
        icon: Github,
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
