import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moof",
  description: "i am <Clarus the Dogcow> also known as MOOF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
