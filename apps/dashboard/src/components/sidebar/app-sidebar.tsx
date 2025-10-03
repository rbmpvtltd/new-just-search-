"use client";

import {
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import Link from "next/link";
import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Just Search",
    email: "justsearch@gmail.com",
    avatar: "/images/favicon.png",
  },
  navMain: [
    {
      title: "Manage Ads",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ads block 1",
          url: "/banners/1",
        },
        {
          title: "Ads block 2",
          url: "/banners/2",
        },
        {
          title: "Ads block 3",
          url: "/banners/3",
        },
        {
          title: "Ads block 4",
          url: "/banners/4",
        },
      ],
    },
    {
      title: "Category Master",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Category",
          url: "/category",
        },
        {
          title: "Subcategory",
          url: "/subcategory",
        },
      ],
    },
    {
      title: "Directory Listing",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Hire Listing",
          url: "/listing/hire",
        },
        {
          title: "Business Listing",
          url: "/listing/business",
        },
      ],
    },
    {
      title: "Manage Customer",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Listing",
          url: "/customer/listing",
        },
        {
          title: "Visitor",
          url: "/customer/visitor",
        },
      ],
    },
  ],

  documents: [
    {
      name: "Offer",
      url: "/offer",
      icon: IconDatabase,
    },
    {
      name: "Manage Plan",
      url: "/plan",
      icon: IconDatabase,
    },
    {
      name: "Manage Franchise",
      url: "/franchise",
      icon: IconDatabase,
    },
    {
      name: "Help & Support",
      url: "/support-ticket",
      icon: IconReport,
    },
    {
      name: "Conversations",
      url: "/conversation",
      icon: IconFileWord,
    },
    {
      name: "Feedback",
      url: "/feedback",
      icon: IconFileWord,
    },
    {
      name: "Account Delete Request",
      url: "/delete-request",
      icon: IconFileWord,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
