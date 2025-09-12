// import { TRPCReactProvider } from "@/trpc/client";
import { HeroHeader } from "@/components/header";
import "./globals.css";
import Navbar from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-darkreader-mode="dynamic"
      data-darkreader-scheme="dark"
      lang="en"
    >
      <body>
        {/* <Navbar/> */}
        <HeroHeader />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
