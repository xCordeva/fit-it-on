"use client";

import BottomNavbar from "@/components/BottomNavbar";
import Canvas from "@/components/Canvas";
import { GalleryModal } from "@/components/GalleryModal";
import Sidebar from "@/components/Sidebar";
import { SignInModal } from "@/components/SignInModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import UploadGuideModal from "@/components/UploadGuideModal";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useEffect } from "react";
import { useAuth } from "../Provider";

export default function AppPage() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebarStore();
  const {
    showUploadGuideModal,
    setShowUploadGuideModal,
    showUpgradeModal,
    setShowUpgradeModal,
    showSignInModal,
    setShowSignInModal,
    showGalleryModal,
    setShowGalleryModal,
  } = useModalStore();

  const { initializeGallery, person, garment } = useGalleryStore();

  useEffect(() => {
    if (user?.id) {
      initializeGallery(user.id);
    }
  }, [user]);

  const folderImages = showGalleryModal === "person" ? person : garment;

  return (
    <>
      <div className="flex h-screen w-full bg-[#f2f2f2]">
        <div
          className={`${
            isCollapsed ? "w-10" : "w-50"
          } flex-shrink-0 transition-all duration-300 hidden md:flex`}
        >
          <Sidebar />
        </div>
        <BottomNavbar />
        <div className="flex-1 p-0 md:p-2 flex h-[calc(100vh-60px)] md:h-auto">
          <Canvas />
        </div>
      </div>
      <UploadGuideModal
        open={showUploadGuideModal}
        onOpenChange={setShowUploadGuideModal}
      />
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
      <GalleryModal
        open={showGalleryModal}
        onOpenChange={setShowGalleryModal}
        images={folderImages}
        type={showGalleryModal as "person" | "garment"}
      />
    </>
  );
}
