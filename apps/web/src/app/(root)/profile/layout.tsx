import { AppSidebar } from "@/components/app-sidebar";
import FooterSection from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider minHeight={true}>
      <AppSidebar />
      <main className="flex min-h-screen w-full flex-col bg-linear-to-br from-gray-50 to-gray-200">
        <SidebarTrigger />
        <div className="flex-1">{children}</div>
        <FooterSection />
      </main>
    </SidebarProvider>
  );
}
