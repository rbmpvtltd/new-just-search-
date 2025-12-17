"use client";
import { IconDatabase, IconFileWord, IconReport } from "@tabler/icons-react";
import { BookOpen, Bot } from "lucide-react";
import type { SidebarData } from "@/types/sidebar";

export const adminSidebarData: SidebarData = {
  user: {
    name: "Just Search",
    email: "justsearch@gmail.com",
    avatar: "/images/favicon.png",
  },
  navMain: [
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
          url: "/hire",
        },
        {
          title: "Business Listing",
          url: "/business",
        },
      ],
    },
    {
      title: "Plans Master",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Plans",
          url: "/plan",
        },
        {
          title: "Attributes",
          url: "/attributes",
        },
      ],
    },
  ],

  documents: [
    {
      name: "Banners",
      url: "/banners",
      icon: IconDatabase,
    },
    {
      name: "Manage Customer",
      url: "/users",
      icon: IconDatabase,
    },
    {
      name: "Offer",
      url: "/offer",
      icon: IconDatabase,
    },
    {
      name: "Product",
      url: "/product",
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
      name: "Manage Saleman",
      url: "/salesman",
      icon: IconDatabase,
    },
    {
      name: "Help & Support",
      url: "/help-support",
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
      name: "Notification",
      url: "/notification",
      icon: IconFileWord,
    },
    {
      name: "Account Delete Request",
      url: "/delete-request",
      icon: IconFileWord,
    },
  ],
};
