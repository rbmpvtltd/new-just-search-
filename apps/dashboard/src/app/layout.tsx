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
      <body>{children}</body>
    </html>
  );
}
