export const dynamic = "force-dynamic";

import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./Provider";
import { getUserData } from "@/lib/getUserData";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Fit It On - AI Virtual Try-On",
  description:
    "Try on any outfit before you buy with AI-powered virtual try-on technology",
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
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
