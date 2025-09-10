"use client";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </div>
  );
}
