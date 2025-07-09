import { create } from "zustand";

interface ReuseState {
  imageUrl: string | null;
  target: "person" | "garment" | null;
  setReuseTarget: (url: string, target: "person" | "garment") => void;
  clearReuse: () => void;
}

export const useReuseStore = create<ReuseState>((set) => ({
  imageUrl: null,
  target: null,
  setReuseTarget: (url, target) => set({ imageUrl: url, target }),
  clearReuse: () => set({ imageUrl: null, target: null }),
}));
