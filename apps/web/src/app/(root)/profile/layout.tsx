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
      <main className="w-full">
        <SidebarTrigger />
        {children}
        <FooterSection />
      </main>
    </SidebarProvider>
  );
}
