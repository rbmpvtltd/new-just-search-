"use client";

import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <HeroHeader />
      {children}
      <Toaster />
      <FooterSection />
    </TRPCReactProvider>
  );
}
