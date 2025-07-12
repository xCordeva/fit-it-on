export const dynamic = "force-dynamic";

import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./Provider";
import { getUserData } from "@/lib/getUserData";
import { PostHogProvider } from "@/components/analytics/PostHog";
import { Analytics } from "@vercel/analytics/next";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Fit It On - AI Virtual Try-On",
  description:
    "See how any outfit looks on you before buying. Fit It On uses AI-powered virtual try-on technology to let you upload your photo, try on clothes virtually, and shop with confidence.",
  openGraph: {
    title: "Fit It On - AI Virtual Try-On",
    description:
      "See how any outfit looks on you before buying. Fit It On uses AI-powered virtual try-on technology to let you upload your photo, try on clothes virtually, and shop with confidence.",
    url: "https://www.fititon.app",
    siteName: "Fit It On",
    images: [
      {
        url: "https://www.fititon.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fit It On - Virtual Try-On Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fit It On - AI Virtual Try-On",
    description:
      "Try on clothes virtually with AI. Upload your photo, choose garments, and visualize your look instantly.",
    images: ["https://www.fititon.app/og-image.jpg"],
  },
  metadataBase: new URL("https://www.fititon.app"),
  themeColor: "#61009E",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user, userData } = await getUserData();
  return (
    <html lang="en">
      <body className={nunito.className}>
        <AuthProvider
          initialSession={session}
          currentUser={user}
          userData={userData}
        >
          <Analytics />
          <PostHogProvider>{children}</PostHogProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
