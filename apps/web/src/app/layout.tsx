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
      <head>
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        ></script>
      </head>
      <body>
        <HeroHeader />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
