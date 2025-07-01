"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SignInCard from "./SignInCard";
import Image from "next/image";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.name
      );
      if (error) throw error;

      toast.success("Account created! You now have 4 free tries.");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <Image
              height={180}
              width={180}
              src="/logo.png"
              alt="fit-it-on-logo"
              className="mb-4"
            />
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign up to get 2 free virtual try-ons and kickstart your style
            journey!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4 mt-6">
            <SignInCard modal={true} />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Name (optional)</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Account & Get 4 Free Tries
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
