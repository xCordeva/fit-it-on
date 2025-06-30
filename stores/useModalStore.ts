import { create } from "zustand";

interface ModalState {
  showSignInModal: boolean;
  showUpgradeModal: boolean;
  setShowSignInModal: (value: boolean) => void;
  setShowUpgradeModal: (value: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showSignInModal: false,
  showUpgradeModal: false,
  setShowSignInModal: (value) => set({ showSignInModal: value }),
  setShowUpgradeModal: (value) => set({ showUpgradeModal: value }),
}));
