"use client";

import { LuCrown } from "react-icons/lu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineBadgeCheck,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { GiClothes } from "react-icons/gi";
import { GrGallery } from "react-icons/gr";
import { useAuth } from "../app/Provider";
import { useModalStore } from "@/stores/useModalStore";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTrials } from "@/hooks/useTrials";
import { LuBadgeInfo } from "react-icons/lu";

export default function BottomNavbar() {
  const { setShowSignInModal, setShowUpgradeModal } = useModalStore();

  const { userData, user, signOut } = useAuth();
  const { remainingTrials } = useTrials();

  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-2 z-50">
      <div className="flex justify-around">
        {/* Studio */}
        <Link href="/app">
          <Button
            variant="ghost"
            className={`text-black ${
              pathname === "/app" ? "text-primary" : "text-black"
            }`}
          >
            <div className="flex flex-col items-center">
              <GiClothes className="h-6 w-6" />
              <span className="text-md">Studio</span>
            </div>
          </Button>
        </Link>

        {/* Gallery */}
        <Link href="/gallery">
          <Button
            variant="ghost"
            className={`text-black ${
              pathname === "/gallery" ? "text-primary" : "text-black"
            }`}
          >
            <div className="flex flex-col items-center">
              <GrGallery className="h-5 w-5" />
              <span className="text-xs">Gallery</span>
            </div>
          </Button>
        </Link>

        {/* Upgrade */}
        {(!userData || userData.plan === "free") && (
          <Button
            variant="ghost"
            onClick={() => setShowUpgradeModal(true)}
            className="flex flex-col items-center text-black"
          >
            <div className="flex flex-col items-center">
              <LuCrown className="h-5 w-5" />
              <span className="text-xs">Upgrade</span>
            </div>
          </Button>
        )}

        {/* User */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="lg" className="gap-2">
                <div className="flex flex-col items-center">
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      height={30}
                      width={30}
                      className="rounded-full"
                      alt="user-image"
                    />
                  ) : (
                    <FaRegUserCircle className="cursor-pointer h-6 w-6" />
                  )}
                  <span>Account</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Profile */}
              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <Link
                  href={"/account"}
                  className="flex items-center justify-center gap-2"
                >
                  <HiOutlineUser className="h-4 w-4" />
                  <span>{user.user_metadata.name}</span>
                </Link>
              </DropdownMenuItem>

              {/* Plan */}
              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  {userData?.plan === "free" ? (
                    <LuBadgeInfo />
                  ) : (
                    <HiOutlineBadgeCheck className="h-4 w-4" />
                  )}
                  <div className="flex flex-col">
                    <span>Current Plan</span>
                    <span className="text-gray-500">{userData?.plan}</span>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Trials */}
              {userData && (
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <HiOutlineClipboardCheck className="h-4 w-4" />
                    <span className="text-gray-500">
                      {remainingTrials} tries left
                    </span>
                  </div>
                </DropdownMenuItem>
              )}

              {/* Sign Out */}
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-2 cursor-pointer"
              >
                <HiOutlineLogout className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowSignInModal(true)}
            className="text-black"
          >
            <div className="flex flex-col items-center">
              <FaRegUserCircle className="h-5 w-5" />
              <span className="text-xs">Sign In</span>{" "}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
