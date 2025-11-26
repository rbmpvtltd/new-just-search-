// import { TRPCReactProvider } from "@/trpc/client";
import { HeroHeader } from "@/components/header";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        ></script>
      </head>
      <body>
        <TRPCReactProvider>
          <HeroHeader />
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
