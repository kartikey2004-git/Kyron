import { LucideIcon } from "lucide-react";

export type IconComponent = React.ElementType;

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavigationItem[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}
