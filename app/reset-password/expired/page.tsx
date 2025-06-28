"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function ExpiredPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 drop-shadow-lg">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              height={180}
              width={180}
              src="/logo.png"
              alt="fit-it-on-logo"
            />
          </div>
          <p className="text-red-600">
            This password reset link has expired or is no longer valid.
          </p>
        </CardHeader>

        <CardContent>
          <Button type="submit" className="w-full bg-primary cursor-pointer">
            <Link href={"/reset-password"}>Request a new link</Link>
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-secondary font-bold hover:underline"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
