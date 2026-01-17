"use client";

import { usePathname } from "next/navigation";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <TRPCReactProvider>
      <HeroHeader />
      {children}
      <Toaster />
      {!pathname.startsWith("/profile") && !pathname.startsWith("/chat") && (
        <FooterSection />
      )}
    </TRPCReactProvider>
  );
}
