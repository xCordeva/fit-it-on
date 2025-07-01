"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Gift, Google } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Image from "next/image";
import { TOAST_CONFIG } from "@/lib/utils";

type SignUpFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>();

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const { error } = await signUp(data.email, data.password, data.name);
      if (error) throw error;

      toast.success("Account created. You’re all set!", {
        ...TOAST_CONFIG.success,
      });
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account", {
        ...TOAST_CONFIG.error,
      });
    }
  };

  const handleGoogleSignUp = async () => {
    await signInWithGoogle();
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
          <CardTitle>Join FitItOn.io!</CardTitle>
          <p className="text-gray-600">
            Create your account to start your virtual try-on journey!
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mt-2 ">
            <Gift className="h-4 w-4" />4 Free Tries Included
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 flex-col">
            {/* Sign up with Google */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full flex  items-center justify-center gap-2"
            >
              <Image
                alt="google-logo"
                height={30}
                width={30}
                src={
                  "https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                }
              />
              Sign up with Google
            </Button>
            {/* Sign up with Facebook */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full flex  items-center justify-center gap-2"
            >
              <Image
                alt="facebook-logo"
                height={30}
                width={30}
                src={
                  "https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
                }
              />
              Sign up with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
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
                  Creating account...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Create Account & Get 4 Free Tries
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-secondary font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
