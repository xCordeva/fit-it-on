"use client";

import { LuCrown } from "react-icons/lu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineLogout } from "react-icons/hi";
import { TbLayoutSidebarRightExpand } from "react-icons/tb";
import { GiClothes } from "react-icons/gi";
import { GrGallery } from "react-icons/gr";
import { useAuth } from "@/hooks/useAuth";
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

export default function Sidebar() {
  const { isCollapsed, toggleSidebarMenu } = useSidebarStore();
  const { setShowSignInModal, showSignInModal } = useModalStore();

  const { user, signOut } = useAuth();
  const { remainingTrials } = useTrials();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-start py-2 px-2 space-y-4 relative transition-all duration-300
        ${isCollapsed ? "w-10" : "w-50"}
      `}
    >
      <Link href="/" className="flex items-center justify-center mb-4 h-10">
        {!isCollapsed ? (
          <Image
            height={180}
            width={180}
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

      {remainingTrials !== null && (
        <div
          className={`text-sm text-gray-600 flex items-center justify-center transition-all m-0 p-0 duration-300 ${
            isCollapsed ? "h-0 opacity-0" : "h-8 opacity-100"
          }`}
        >
          {remainingTrials} <span>&nbsp;tries left</span>
        </div>
      )}

      <Button className="bg-[#facc15] text-black font-bold hover:bg-[#facc15]/70">
        <div className="flex items-center justify-center gap-1">
          <LuCrown className="h-5 w-5" />
          {!isCollapsed && (
            <span
              className={`${
                isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
              }`}
            >
              Unlock Pro Features
            </span>
          )}
        </div>
      </Button>

      {/* Links */}
      <Button
        variant="ghost"
        className={`text-black font-bold rounded-sm border-2 flex items-center ${
          isCollapsed ? "justify-center" : "justify-start"
        }
          ${
            pathname === "/app"
              ? "bg-gray-200 border-gray-500 shadow-lg"
              : "hover:bg-gray-200 border-transparent"
          }
          `}
      >
        <Link href={"/app"} className="flex items-center  gap-1">
          <GiClothes className="h-5 w-5" />
          {!isCollapsed && <span>Studio</span>}
        </Link>
      </Button>
      <Button
        variant="ghost"
        className={`text-black font-bold rounded-sm border-2 flex items-center ${
          isCollapsed ? "justify-center" : "justify-start"
        }
          ${
            pathname === "/gallery"
              ? "bg-gray-200 border-gray-500 shadow-lg"
              : "hover:bg-gray-200 border-transparent"
          }
          `}
      >
        <Link href={"/gallery"} className="flex items-center  gap-1">
          <GrGallery className="h-5 w-5" />
          {!isCollapsed && <span>Gallery</span>}
        </Link>
      </Button>
      
      {/* Bottom Section */}
      <div className="absolute w-46 bottom-0 flex flex-col justify-center py-2 space-y-4">
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
                  <FaRegUserCircle size={30} />
                )
              ) : (
                <Button
                  variant="ghost"
                  size="lg"
                  className="gap-2"
                >
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      height={30}
                      width={30}
                      className="rounded-full"
                      alt="user-image"
                    />
                  ) : (
                    <FaRegUserCircle size={30} />
                  )}
                  <span>{user.user_metadata.full_name}</span>
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
          } flex items-center justify-center gap-4  transition-h duration-300"`}
        >
          {!isCollapsed && (
            <>
              <Link className="text-xs hover:underline text-nowrap" href={"/"}>
                Privacy Policy
              </Link>
              <Link className="text-xs hover:underline text-nowrap" href={"/"}>
                Terms of use
              </Link>
            </>
          )}
        </div>

        <button onClick={toggleSidebarMenu} className="flex items-center">
          <TbLayoutSidebarRightExpand
            size={30}
            className={`transition-transform duration-300
              ${isCollapsed ? "rotate-180" : ""}
            `}
          />
        </button>
      </div>
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </div>
  );
}
