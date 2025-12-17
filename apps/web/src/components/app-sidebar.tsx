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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/(root)/profile",
    icon: Home,
  },
  {
    title: "User Details",
    url: "/profile",
    icon: User,
  },
  {
    title: "My Business Listings",
    url: "/profile/business",
    icon: Building2,
  },
  {
    title: "Add Product",
    url: "/profile/product/add",
    icon: PlusSquare,
  },
  {
    title: "My Products",
    url: "/profile/product",
    icon: Package,
  },
  {
    title: "Add Offer",
    url: "/profile/offer/add",
    icon: Tag,
  },
  {
    title: "My Offers",
    url: "/profile/offer",
    icon: Tag,
  },
  {
    title: "My Hire Listings",
    url: "/profile/hire",
    icon: Briefcase,
  },
  {
    title: "Pricing Plan",
    url: "/plans",
    icon: CreditCard,
  },
  {
    title: "Help & Support",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Feedback",
    url: "/profile/feedback",
    icon: MessageCircle,
  },
  {
    title: "Request to Delete Account",
    url: "/profile/account-delete-request",
    icon: Trash2,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
