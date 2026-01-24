"use client";
import {
  IconBell,
  IconBox,
  IconClipboardList,
  IconDatabase,
  IconDeviceMobile,
  IconDiscount2,
  IconFileWord,
  IconHelp,
  IconKey,
  IconMessage,
  IconMessageReport,
  IconNetwork,
  IconPhoto,
  IconReport,
  IconTrash,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { BookOpen, Bot, CreditCard, Layers, Tags } from "lucide-react";
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
      icon: Layers,
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
      icon: CreditCard,
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
      icon: IconPhoto,
    },
    {
      name: "Manage Customer",
      url: "/users",
      icon: IconUser,
    },
    {
      name: "Offers",
      url: "/offer",
      icon: IconDiscount2,
    },
    {
      name: "Products",
      url: "/product",
      icon: IconBox,
    },
    {
      name: "Manage Plan",
      url: "/plan",
      icon: IconClipboardList,
    },
    {
      name: "Manage Franchise",
      url: "/franchise",
      icon: IconNetwork,
    },
    {
      name: "Manage Saleman",
      url: "/salesman",
      icon: IconUserCheck,
    },
    {
      name: "Help & Support",
      url: "/help-support",
      icon: IconHelp,
    },
    {
      name: "Conversations",
      url: "/conversation",
      icon: IconMessage,
    },
    {
      name: "Feedback",
      url: "/feedback",
      icon: IconMessageReport,
    },
    {
      name: "Notification",
      url: "/notification",
      icon: IconBell,
    },
    {
      name: "Account Delete Request",
      url: "/delete-request",
      icon: IconTrash,
    },
    {
      name: "Mobile Version Update",
      url: "/update",
      icon: IconDeviceMobile,
    },
    {
      name: "Change Password",
      url: "/change-password",
      icon: IconKey,
    },
  ],
};
