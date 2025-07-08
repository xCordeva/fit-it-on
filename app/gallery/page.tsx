"use client";

import Gallery from "@/components/Gallery";
import Sidebar from "@/components/Sidebar";
import { SignInModal } from "@/components/SignInModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function GalleryPage() {
  const { isCollapsed } = useSidebarStore();
  const {
    showUpgradeModal,
    setShowUpgradeModal,
    showSignInModal,
    setShowSignInModal,
  } = useModalStore();
  return (
    <div className="flex h-screen w-full bg-[#f2f2f2]">
      <div className={`${isCollapsed ? "w-20" : "w-50"}" flex-shrink-0"`}>
        <Sidebar />
      </div>
      <div className="flex-1 p-2 flex overflow-auto">
        <Gallery />
      </div>
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
      <SignInModal open={showSignInModal} onOpenChange={setShowSignInModal} />
    </div>
  );
}
