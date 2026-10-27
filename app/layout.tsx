import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { meta } from "@/lib/content";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="ar" className={cairo.variable}>
      <body className="font-sans antialiased bg-bg text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
