"use client";
import { IconHome, IconUserCheck } from "@tabler/icons-react";
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
      name: "Manage Saleman",
      url: "/salesman",
      icon: IconUserCheck,
    },
  ],
};
