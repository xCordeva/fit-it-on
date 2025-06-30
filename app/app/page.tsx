"use client";

import Canvas from "@/components/Canvas";
import Sidebar from "@/components/Sidebar";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function GalleryPage() {
  const { isCollapsed } = useSidebarStore();
  return (
    <div className="flex h-screen w-full bg-[#f2f2f2]">
      <div
        className={`${
          isCollapsed ? "w-10" : "w-50"
        } flex-shrink-0 transition-all duration-300"`}
      >
        <Sidebar />
      </div>
      <div className="flex-1 p-2 flex overflow-auto">
        <Canvas />
      </div>
    </div>
  );
}
