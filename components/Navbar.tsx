"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { useAuth } from "../app/Provider";
import { useTrials } from "@/hooks/useTrials";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { GiClothes } from "react-icons/gi";
import { IoIosPricetags } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { remainingTrials } = useTrials();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              height={120}
              width={120}
              className="max-h-8 w-auto"
              src="/logo.png"
              alt="fit-it-on-logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/studio"
              className="text-gray-700 hover:text-primary transition-colors flex gap-1 items-center justify-center "
            >
              <GiClothes className="size-5" />
              Studio
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 hover:text-primary transition-colors flex gap-1 items-center justify-center "
            >
              <GrGallery className="size-5" />
              Gallery
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-primary transition-colors flex gap-1 items-center justify-center "
            >
              <IoIosPricetags className="size-5" />
              Pricing
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {remainingTrials !== Infinity && (
                  <span className="text-sm text-gray-600">
                    {remainingTrials} tries left
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {user.user_metadata.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          height={20}
                          width={20}
                          className="rounded-full"
                          alt="user-image"
                        />
                      ) : (
                        <FaRegUser className="h-5 w-5" />
                      )}
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                      <Link href="/account">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="gap-2 cursor-pointer"
                    >
                      <LuLogOut className="h-5 w-5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-gray-200">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-black hover:bg-black/90">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <IoClose className="h-5 w-5" />
              ) : (
                <IoIosMenu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/studio"
              className="block text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Studio
            </Link>

            <Link
              href="/gallery"
              className="block text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>

            <Link
              href="/pricing"
              className="block text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {user ? (
              <>
                <Link
                  href="/account"
                  className="block text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                {remainingTrials !== Infinity && (
                  <div className="text-sm text-gray-600 py-2">
                    {remainingTrials} tries left
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleSignOut}
                >
                  <LuLogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
