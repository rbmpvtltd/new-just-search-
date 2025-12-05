"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { HeroHeader } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <HeroHeader />
      {children}
      <Toaster />
    </TRPCReactProvider>
  );
}
