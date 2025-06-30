import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebarMenu: () => void;
  setCollapsed: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleSidebarMenu: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
        })),
      setCollapsed: (value) =>
        set(() => ({
          isCollapsed: value,
        })),
    }),
    {
      name: "sidebar-storage",
    }
  )
);
