import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { meta } from "@/lib/content";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

// Absolute URL for OG/twitter images and sitemap/robots.
// Priority: explicit NEXT_PUBLIC_SITE_URL > Vercel-injected URL > localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  openGraph: {
    title: "السعد للدراجات النارية",
    description: "قطع غيار أصلية، دراجات جديدة ومستعملة، وخدمة صيانة معتمدة من أكبر ماركات العالم. 35+ سنة خبرة.",
    locale: "ar_EG",
    type: "website",
    siteName: "ELSAAD",
  },
  twitter: {
    card: "summary_large_image",
    title: "السعد للدراجات النارية",
    description: "قطع غيار أصلية، دراجات جديدة ومستعملة، وخدمة صيانة معتمدة.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
