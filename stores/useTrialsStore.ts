import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrialsState {
  anonTrials: number | undefined;
  setAnonTrials: (value: number | undefined) => void;
  _hasHydrated: boolean; // New flag to track hydration status
  setHasHydrated: (value: boolean) => void; // Setter for hydration flag
}

export const useTrialsStore = create<TrialsState>()(
  persist(
    (set, get) => ({
      anonTrials: undefined, // Default initial state for SSR
      setAnonTrials: (value) => set({ anonTrials: value }),
      _hasHydrated: false, // Initialize as false
      setHasHydrated: (value) => {
        set({ _hasHydrated: value });
      },
    }),
    {
      name: "anon-trials-storage", // name in localStorage
      // This part is crucial for hydration
      onRehydrateStorage: () => (state) => {
        // This function runs after rehydration from storage
        if (state) {
          state.setHasHydrated(true); // Mark as hydrated
        }
      },
    }
  )
);
