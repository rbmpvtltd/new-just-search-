"use client";

import { usePathname } from "next/navigation";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideFooter =
    pathname.startsWith("/profile") || pathname.startsWith("/chat");

  return (
    <>
      <HeroHeader />
      {children}
      <Toaster />
      {!hideFooter && <FooterSection />}
    </>
  );
}
