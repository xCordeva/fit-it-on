"use client";

import Gallery from "@/components/Gallery";
import Sidebar from "@/components/Sidebar";
import { SignInModal } from "@/components/SignInModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useEffect } from "react";
import { useAuth } from "../Provider";
import BottomNavbar from "@/components/BottomNavbar";

export default function GalleryPage() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebarStore();
  const {
    showUpgradeModal,
    setShowUpgradeModal,
    showSignInModal,
    setShowSignInModal,
  } = useModalStore();

  const { initializeGallery, person, garment, results, loading } =
    useGalleryStore();

  useEffect(() => {
    if (user?.id) {
      initializeGallery(user.id);
    }
  }, [user]);

  return (
    <div className="flex h-screen w-full bg-[#f2f2f2]">
      <div
        className={`${
          isCollapsed ? "w-10" : "w-50"
        } flex-shrink-0 transition-all duration-300 hidden md:flex`}
      >
        <Sidebar />
      </div>
      <BottomNavbar />
      <div className="flex-1 p-0 md:p-2 mb-18 md:mb-0 flex overflow-y-auto">
        <Gallery
          user={user}
          person={person}
          garment={garment}
          results={results}
          loading={loading}
        />
      </div>
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </div>
  );
}
