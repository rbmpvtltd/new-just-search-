import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { redirect } from "next/navigation";
import { getToken } from "@/utils/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("main layout token is ", await getToken());
  const verityDashboardUser = await asyncHandler(
    trpcServer.auth.dashboardverify.query(),
  );
  console.log("verityDashboardUser", verityDashboardUser);
  if (verityDashboardUser.data?.success) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 bg-[#f7f7f7f7] flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return redirect("/login");
}
