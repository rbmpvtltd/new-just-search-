"use client";
import {
  IconBuildingSkyscraper,
  IconHome,
  IconUsers,
} from "@tabler/icons-react";
import type { SidebarData } from "@/types/sidebar";

export const adminSidebarData: SidebarData = {
  user: {
    name: "Just Search",
    email: "justsearch@gmail.com",
    avatar: "/images/favicon.png",
  },
  navMain: [],

  documents: [
    {
      name: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      name: "Manage Business",
      url: "/business",
      icon: IconBuildingSkyscraper,
    },
    {
      name: "Manage Hire",
      url: "/hire",
      icon: IconUsers,
    },
  ],
};
