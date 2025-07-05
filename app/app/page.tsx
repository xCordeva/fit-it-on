"use client";

import BottomNavbar from "@/components/BottomNavbar";
import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";
import { SignInModal } from "@/components/SignInModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import UploadGuideModal from "@/components/UploadGuideModal";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function AppPage() {
  const { isCollapsed } = useSidebarStore();
  const {
    showUploadGuideModal,
    setShowUploadGuideModal,
    showUpgradeModal,
    setShowUpgradeModal,
    showSignInModal,
    setShowSignInModal,
  } = useModalStore();
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
        <div className="flex-1 p-0 md:p-2 flex overflow-auto">
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
    </>
  );
}
