"use client";

import { useParams, notFound } from "next/navigation";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useEffect } from "react";
import { useAuth } from "@/app/Provider";
import ImagesContainer from "@/components/ImagesContainer";
import Sidebar from "@/components/Sidebar";
import { SignInModal } from "@/components/SignInModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import BottomNavbar from "@/components/BottomNavbar";

const VALID_FOLDERS = ["person", "garment", "results"] as const;
type FolderType = (typeof VALID_FOLDERS)[number];

export default function GalleryFolderPage() {
  const { user } = useAuth();
  const { folder } = useParams() as {
    folder: FolderType;
  };

  const { isCollapsed } = useSidebarStore();
  const {
    showUpgradeModal,
    setShowUpgradeModal,
    showSignInModal,
    setShowSignInModal,
  } = useModalStore();

  // Check if folder is valid
  if (!VALID_FOLDERS.includes(folder as FolderType)) {
    return notFound();
  }

  const { initializeGallery, person, garment, results, loading } =
    useGalleryStore();

  useEffect(() => {
    if (user?.id) {
      initializeGallery(user.id);
    }
  }, [user]);

  const folderImages =
    folder === "person" ? person : folder === "garment" ? garment : results;

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
      <div className="flex-1 p-2 flex overflow-auto">
        <ImagesContainer
          folder={folder}
          folderImages={folderImages}
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
