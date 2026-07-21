import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://the-blue-between-us.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Blue Between Us — For Shekinah",
  description: "A small interactive universe from Marc to Shekinah, across every blue mile.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "The Blue Between Us — For Shekinah",
    description: "A love story that began before the first hello in the same room.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", title: "The Blue Between Us — For Shekinah", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
