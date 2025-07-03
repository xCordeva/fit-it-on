"use client";

import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";
import { UpgradeModal } from "@/components/UpgradeModal";
import UploadGuideModal from "@/components/UploadGuideModal";
import { useModalStore } from "@/stores/useModalStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function GalleryPage() {
  const { isCollapsed } = useSidebarStore();
  const {
    showUploadGuideModal,
    setShowUploadGuideModal,
    showUpgradeModal,
    setShowUpgradeModal,
  } = useModalStore();
  return (
    <div className="flex h-screen w-full bg-[#f2f2f2]">
      <div
        className={`${
          isCollapsed ? "w-10" : "w-50"
        } flex-shrink-0 transition-all duration-300`}
      >
        <Sidebar />
      </div>
      <div className="flex-1 p-2 flex overflow-auto">
        <Canvas />
        <UploadGuideModal
          open={showUploadGuideModal}
          onOpenChange={setShowUploadGuideModal}
        />
        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
        />
      </div>
    </div>
  );
}
