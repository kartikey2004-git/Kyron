import { NavigationSection } from "@/types/navigation";
import { BookOpen, CreditCard, MessageSquare, Settings } from "lucide-react";
import { FiGithub } from "react-icons/fi";

// configuration of sidebar navigation in dashboard

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
        icon: FiGithub,
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
