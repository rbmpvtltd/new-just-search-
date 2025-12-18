"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
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
import type { SidebarData } from "@/types/sidebar";

export function AppSidebar({
  data,
  currentPath,
}: {
  data: SidebarData;
  currentPath: string;
}) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={currentPath}>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Just Search</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.length > 0 && (
          <NavMain items={data.navMain} currentPath={currentPath} />
        )}
        {data.documents.length > 0 && (
          <NavDocuments items={data.documents} currentPath={currentPath} />
        )}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
