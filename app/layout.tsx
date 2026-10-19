import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { slab } from "./fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finunies.vercel.app"),
  title: "FinUnies",
  description: "Search for universities in Finland",
  // Icons come from app/favicon.ico, app/icon.png and app/apple-icon.png (the Unies cap-and-book)
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${slab.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
