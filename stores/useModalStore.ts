import { create } from "zustand";

interface ModalState {
  showSignInModal: boolean;
  showUpgradeModal: boolean;
  showUploadGuideModal: boolean;
  showGalleryModal: "person" | "garment" | null;
  setShowSignInModal: (value: boolean) => void;
  setShowUpgradeModal: (value: boolean) => void;
  setShowUploadGuideModal: (value: boolean) => void;
  setShowGalleryModal: (value: "person" | "garment" | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showSignInModal: false,
  showUpgradeModal: false,
  showUploadGuideModal: false,
  showGalleryModal: null,
  setShowSignInModal: (value) => set({ showSignInModal: value }),
  setShowUpgradeModal: (value) => set({ showUpgradeModal: value }),
  setShowUploadGuideModal: (value) => set({ showUploadGuideModal: value }),
  setShowGalleryModal: (value) => set({ showGalleryModal: value }),
}));
