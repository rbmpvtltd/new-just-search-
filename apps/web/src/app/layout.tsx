"use client";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import Providers from "./Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" async />
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
