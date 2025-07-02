"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../app/Provider";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/lib/utils";
import Image from "next/image";
import { useModalStore } from "@/stores/useModalStore";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function SignInCard({ modal = false }: { modal?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { setShowSignInModal } = useModalStore();
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;

      toast.success("Login successful, welcome back!", {
        ...TOAST_CONFIG.success,
      });
      router.push("/app");
      if (modal) {
        setShowSignInModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in", {
        ...TOAST_CONFIG.error,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };
  const Wrapper = modal ? "div" : Card;
  const SecondaryWrapper = modal ? "div" : CardContent;

  return (
    <Wrapper className="w-full max-w-md">
      {!modal && (
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              height={180}
              width={180}
              src="/logo.png"
              alt="fit-it-on-logo"
            />
          </div>
          <CardTitle>Welcome Back!</CardTitle>
          <p className="text-gray-800">
            Sign in to continue your virtual try-on journey
          </p>
        </CardHeader>
      )}

      <SecondaryWrapper>
        <div className="flex gap-4 flex-col">
          {/* Sign in with Google */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Image
              alt="google-logo"
              height={30}
              width={30}
              src={
                "https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              }
            />
            Sign in with Google
          </Button>
          {/* Sign in with Facebook */}
          <Button
            onClick={handleGoogleSignIn}
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
            Sign in with Facebook
          </Button>
        </div>
        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-md">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
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
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2" />
                Signing in...
              </>
            ) : (
              <>Sign In</>
            )}
          </Button>
        </form>

        {!modal && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-secondary hover:underline font-bold"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link
              href="/reset-password"
              className="text-blue-500 underline hover:no-underline"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </SecondaryWrapper>
    </Wrapper>
  );
}
