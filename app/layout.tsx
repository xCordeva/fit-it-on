export const dynamic = "force-dynamic";

import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AuthProvider } from "./Provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FitItOn.io - AI Virtual Try-On",
  description:
    "Try on any outfit before you buy with AI-powered virtual try-on technology",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={nunito.className}>
        <AuthProvider initialSession={session} currentUser={user}>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
