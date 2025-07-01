"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { TOAST_CONFIG } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function NewPasswordPage() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { setSession, updatePassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string }>();

  useEffect(() => {
    // Extract tokens from URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    if (type !== "recovery" || !access_token || !refresh_token) {
      toast.error("Invalid or expired reset link.", { ...TOAST_CONFIG.error });
      router.replace("/reset-password/expired");
      return;
    }

    // Set the session so user is authenticated
    setSession(access_token, refresh_token).then(({ error }) => {
      if (error) {
        toast.error("Session error: " + error.message, {
          ...TOAST_CONFIG.error,
        });
        router.replace("/login");
      } else {
        setIsReady(true);
      }
    });
  }, [router]);

  const onSubmit = async (data: { password: string }) => {
    const { error } = await updatePassword(data.password);

    if (error) {
      toast.error(error.message, { ...TOAST_CONFIG.error });
      return;
    }

    toast.success("Password updated successfully!", {
      ...TOAST_CONFIG.success,
    });
    router.replace("/login");
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
        <span className="ml-2">Verifying reset link...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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

          <p className="text-gray-600">
            Last step! All you have to do now is set a new password.
          </p>
        </CardHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white px-6 pb-6 rounded shadow space-y-4"
        >
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>Set New Password</>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
