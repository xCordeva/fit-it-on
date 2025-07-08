import { create } from "zustand";
import { fetchUserPhotoFromSupabase } from "@/lib/galleryHelpers";

type GalleryStore = {
  person: string[];
  garment: string[];
  results: string[];
  loading: boolean;
  initialized: boolean;
  initializeGallery: (userId: string) => Promise<void>;
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  person: [],
  garment: [],
  results: [],
  loading: true,
  initialized: false,

  initializeGallery: async (userId) => {
    const { initialized } = get();
    if (initialized || !userId) return;

    try {
      const [personUrls, garmentUrls, resultUrls] = await Promise.all([
        fetchUserPhotoFromSupabase(userId, "person"),
        fetchUserPhotoFromSupabase(userId, "garment"),
        fetchUserPhotoFromSupabase(userId, "results"),
      ]);

      set({
        person: personUrls ?? [],
        garment: garmentUrls ?? [],
        results: resultUrls ?? [],
        initialized: true,
      });
    } catch (error) {
      console.error("Failed to load gallery images:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
