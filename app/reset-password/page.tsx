"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import { TOAST_CONFIG } from "@/lib/utils";

type SignUpFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>();

  const { resetPassword } = useAuth();

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const { error } = await resetPassword(data.email);
      if (error) throw error;

      toast.success(
        "If an account with this email exists, a password reset link has been sent.",
        {
          ...TOAST_CONFIG.success,
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Something went wrong, please try again.", {
        ...TOAST_CONFIG.error,
      });
    }
  };

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
          <p className="text-gray-600">
            Don't worry! We'll send you an email with instructions to reset your
            password.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset email...
                </>
              ) : (
                <>Reset Password</>
              )}
            </Button>
          </form>

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
