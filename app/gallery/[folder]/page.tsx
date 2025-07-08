"use client";

import { useParams } from "next/navigation";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useEffect } from "react";
import { useAuth } from "@/app/Provider";

export default function GalleryFolderPage() {
  const { user } = useAuth();
  const { folder } = useParams() as {
    folder: "person" | "garment" | "results";
  };
  const { initializeGallery, person, garment, results } = useGalleryStore();

  useEffect(() => {
    if (user?.id) {
      initializeGallery(user.id);
    }
  }, [user]);

  const folderImages =
    folder === "person" ? person : folder === "garment" ? garment : results;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 capitalize">{folder} Gallery</h1>
      {folderImages.length === 0 ? (
        <p>No images found in this folder.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {folderImages.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${folder}-${idx}`}
              className="rounded cursor-pointer hover:scale-105 transition-transform"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  );
}
