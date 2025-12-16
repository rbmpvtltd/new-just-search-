import type { Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

interface SubNavItem {
  title: string;
  url: string;
}
export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: SubNavItem[];
}

export interface DocumentItem {
  name: string;
  url: string;
  icon: Icon;
}

export interface SideBarUser {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarData {
  user: SideBarUser;
  navMain: NavItem[];
  documents: DocumentItem[];
}
