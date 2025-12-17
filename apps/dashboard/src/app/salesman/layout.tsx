import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { redirectRole } from "@/utils/redirect";
import { adminSidebarData } from "./sidebar-data";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const verityDashboardUser = await asyncHandler(
    trpcServer.auth.dashboardverify.query(),
  );
  console.log("verityDashboardUser", verityDashboardUser);
  if (verityDashboardUser.data?.success) {
    if (verityDashboardUser.data.role !== "salesman") {
      return redirect(redirectRole(verityDashboardUser.data.role ?? ""));
    }
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar data={adminSidebarData} currentPath="/salesman" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 bg-[#f7f7f7f7] flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return redirect("/login");
}
