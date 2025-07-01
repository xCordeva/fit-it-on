import { create } from "zustand";

interface ModalState {
  showSignInModal: boolean;
  showUpgradeModal: boolean;
  showUploadGuideModal: boolean;
  setShowSignInModal: (value: boolean) => void;
  setShowUpgradeModal: (value: boolean) => void;
  setShowUploadGuideModal: (value: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showSignInModal: false,
  showUpgradeModal: false,
  showUploadGuideModal: false,
  setShowSignInModal: (value) => set({ showSignInModal: value }),
  setShowUpgradeModal: (value) => set({ showUpgradeModal: value }),
  setShowUploadGuideModal: (value) => set({ showUploadGuideModal: value }),
}));
