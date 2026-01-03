import type { UserRole } from "@repo/db";
import {
  Briefcase,
  Building2,
  CreditCard,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Package,
  PlusSquare,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { title } from "process";
import type { ComponentType } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/authStore";
import { getRole } from "@/utils/session";

// Menu items.

interface SidebarField {
  key?: string;
  title?: string;
  url?: string;
  icon?: ComponentType<any> | undefined;
  role?: UserRole[] | UserRole;
  authenticated?: boolean;
}

const items: SidebarField[] = [
  {
    title: "Home",
    url: "/(root)/profile",
    icon: Home,
    role: "all",
  },
  {
    title: "User Details",
    url: "/profile",
    icon: User,
    role: "all",
  },
  {
    title: "My Business Listings",
    url: "/profile/business",
    icon: Building2,
    role: ["business", "visiter", "guest"],
  },
  {
    title: "Add Product",
    url: "/profile/product/add",
    icon: PlusSquare,
    role: "business",
  },
  {
    title: "My Products",
    url: "/profile/product",
    icon: Package,
    role: "business",
  },
  {
    title: "Add Offer",
    url: "/profile/offer/add",
    icon: Tag,
    role: "business",
  },
  {
    title: "My Offers",
    url: "/profile/offer",
    icon: Tag,
    role: "business",
  },
  {
    title: "My Hire Listings",
    url: "/profile/hire",
    icon: Briefcase,
    role: ["hire", "visiter", "guest"],
  },
  {
    title: "Pricing Plan",
    url: "/profile/plans",
    icon: CreditCard,
    role: "all",
  },
  {
    title: "Help & Support",
    url: "/profile/help-and-support",
    icon: HelpCircle,
    role: "all",
  },
  {
    title: "Feedback",
    url: "/profile/feedback",
    icon: MessageCircle,
    role: "all",
  },
  {
    title: "Request to Delete Account",
    url: "/profile/account-delete-request",
    icon: Trash2,
    role: ["visiter", "guest", "hire", "business"],
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    role: "all",
  },
];

export async function AppSidebar() {
  let role = await getRole();

  if (!role) {
    role = "all";
  }

  const itemdata = items.filter(
    (item) => item?.role?.includes(role) || item?.role === "all",
  );
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemdata.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
