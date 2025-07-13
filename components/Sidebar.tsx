"use client";

import { LuCrown } from "react-icons/lu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineLogout } from "react-icons/hi";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { GiClothes } from "react-icons/gi";
import { GrGallery } from "react-icons/gr";
import { useAuth } from "../app/Provider";
import { useTrials } from "@/hooks/useTrials";
import { FaRegUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useModalStore } from "@/stores/useModalStore";
import { SignInModal } from "./SignInModal";
import { useTrialsStore } from "@/stores/useTrialsStore";

export default function Sidebar() {
  const { isCollapsed, toggleSidebarMenu } = useSidebarStore();
  const { setShowSignInModal, showSignInModal, setShowUpgradeModal } =
    useModalStore();

  const { anonTrials } = useTrialsStore();
  const { user, signOut, userData } = useAuth();
  const { remainingTrials } = useTrials();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div
      className={`flex flex-col justify-between min-h-screen py-2 px-2 transition-all duration-300  
        ${isCollapsed ? "w-10" : "w-50"}
      `}
    >
      <div className="flex flex-col justify-start space-y-4 h-[50%]">
        <Link href="/" className="flex items-center justify-center mb-4 h-10">
          {!isCollapsed ? (
            <Image
              height={180}
              width={180}
              className="max-h-10 w-180"
              src="/logo.png"
              alt="fit-it-on-logo"
            />
          ) : (
            <Image
              height={40}
              width={40}
              src="/f-logo.png"
              alt="fit-it-on-f-logo"
            />
          )}
        </Link>

        <div
          className={`text-sm text-gray-600 flex items-center justify-center transition-all m-0 p-0 duration-300 ${
            isCollapsed ? "h-0 opacity-0" : "h-8 opacity-100"
          }`}
        >
          {user ? (
            // Show normal user-based trial count
            <div>{remainingTrials} tries left</div>
          ) : anonTrials === undefined ? (
            // While loading

            <span className="loader"></span>
          ) : (
            // Once loaded
            <div className="text-sm text-gray-600">{anonTrials} tries left</div>
          )}
        </div>

        {!user || userData?.plan === "free" ? (
          <Button
            className={`bg-[#facc15] text-black font-bold hover:bg-[#facc15]/70 overflow-hidden gap-1 ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            onClick={() => setShowUpgradeModal(true)}
          >
            <LuCrown className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Unlock Pro Features</span>}
          </Button>
        ) : (
          !isCollapsed && (
            <div className="flex items-center gap-2 p-2 rounded-lg justify-center text-sm font-bold bg-[#facc15]">
              <LuCrown className="text-black" />
              <span className="text-black">Current plan: {userData?.plan}</span>
            </div>
          )
        )}

        {/* Links */}
        <Link
          href={"/studio"}
          className={`text-black font-bold rounded-sm border-2  overflow-hidden py-2 px-4 gap-2 text-bold flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          }
          ${
            pathname === "/studio"
              ? "bg-gray-200 border-gray-500 shadow-lg"
              : "hover:bg-gray-200 border-transparent"
          }
          `}
        >
          <GiClothes className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Studio</span>}
        </Link>

        <Link
          href={"/gallery"}
          className={`text-black font-bold rounded-sm border-2  overflow-hidden py-2 px-4 gap-2 text-bold flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          }
          ${
            pathname.startsWith("/gallery")
              ? "bg-gray-200 border-gray-500 shadow-lg"
              : "hover:bg-gray-200 border-transparent"
          }
          `}
        >
          <GrGallery className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Gallery</span>}
        </Link>
      </div>

      {/* Bottom Section */}
      <div
        className={`h-[50%] flex flex-col justify-end py-2 space-y-4 transition-all duration-300  
        ${isCollapsed ? "w-10" : "w-46"}`}
      >
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isCollapsed ? (
                user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    height={30}
                    width={30}
                    className="rounded-full cursor-pointer"
                    alt="user-image"
                  />
                ) : (
                  <FaRegUserCircle size={30} className="cursor-pointer" />
                )
              ) : (
                <Button variant="ghost" size="lg" className="gap-2">
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      height={30}
                      width={30}
                      className="rounded-full"
                      alt="user-image"
                    />
                  ) : (
                    <FaRegUserCircle size={30} className="cursor-pointer" />
                  )}
                  <span>{user.user_metadata.name}</span>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <Link href="/account">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="gap-2 cursor-pointer"
              >
                <HiOutlineLogout className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : isCollapsed ? (
          <FaRegUserCircle
            size={30}
            className="cursor-pointer"
            onClick={() => {
              setShowSignInModal(true);
            }}
          />
        ) : (
          <Button
            className="bg-primary text-white hover:bg-primary/80 hover:text-white"
            onClick={() => {
              setShowSignInModal(true);
            }}
          >
            Sign In
          </Button>
        )}
        <div
          className={`${
            isCollapsed ? "h-0" : "h-4"
          } flex items-center justify-center gap-4  transition-h duration-300 mb-6`}
        >
          {!isCollapsed && (
            <div className="flex gap-2 flex-col">
              <div className="flex gap-4 pt-4">
                <Link
                  className="text-xs hover:underline text-nowrap"
                  href={"/privacy-policy"}
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-xs hover:underline text-nowrap"
                  href={"/terms-of-use"}
                  target="_blank"
                >
                  Terms of use
                </Link>
              </div>
              <div className="text-xs text-center">
                Having trouble?{" "}
                <Link
                  className="text-gray-600 underline hover:no-underline text-nowrap"
                  href={"/contact"}
                  target="_blank"
                >
                  Contact us
                </Link>
              </div>
            </div>
          )}
        </div>
        <TbLayoutSidebarRightExpand
          size={30}
          onClick={toggleSidebarMenu}
          className={`transition-transform duration-300 cursor-pointer 
              ${isCollapsed ? "rotate-180" : ""}
            `}
        />
      </div>
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </div>
  );
}
