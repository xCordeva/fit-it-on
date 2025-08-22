"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInCard from "./SignInCard";
import Image from "next/image";
import SignUpCard from "./SignUpCard";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col rounded-lg">
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
            Sign up to get 3 free virtual try-ons and kickstart your style
            journey!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className="cursor-pointer">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="cursor-pointer">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <SignInCard modal={true} />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <SignUpCard modal={true} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
