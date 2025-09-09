import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

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
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
