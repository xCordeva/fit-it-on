"use client";

import { useModalStore } from "@/stores/useModalStore";
import FolderCard from "@/components/FolderCard";
import { useRouter } from "next/navigation";
import { GalleryStore } from "@/stores/useGalleryStore";
import { User } from "@supabase/supabase-js";
import { HiOutlinePhotograph } from "react-icons/hi";

interface GalleryProps
  extends Omit<
    GalleryStore,
    "initializeGallery" | "refetchGallery" | "initialized"
  > {
  user: User | null;
}

export default function Gallery({
  user,
  person,
  garment,
  results,
  loading,
}: GalleryProps) {
  const { setShowSignInModal } = useModalStore();
  const router = useRouter();

  const hasValidImages = (images: string[]): boolean => {
    return (
      images.filter((url) => !url.includes(".emptyFolderPlaceholder")).length >
      0
    );
  };

  const showFolders =
    hasValidImages(person) ||
    hasValidImages(garment) ||
    hasValidImages(results);

  return (
    <main className="flex justify-center p-4 md:py-10 bg-[#f2f2f2] md:bg-white rounded-lg md:shadow-xl w-full h-full overflow-auto">
      <div className="p-6 w-full max-w-6xl">
        {!user ? (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800 shadow-sm w-fit mx-auto">
            <strong>Want to save your try-ons?</strong> <br />
            Create a free account to track and manage your virtual try-ons.
            <br />
            <button
              onClick={() => setShowSignInModal(true)}
              className="inline-block mt-2 text-blue-600 underline hover:text-blue-800 cursor-pointer"
            >
              Sign up now
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center min-h-[90vh]">
            <img
              src="/loading.gif"
              alt="fit-it-on-loading-gif"
              className="w-auto h-40"
            />
          </div>
        ) : showFolders ? (
          <div className="flex gap-6 justify-center flex-wrap">
            {hasValidImages(person) && (
              <FolderCard
                title="Person"
                images={person}
                onClick={() => router.push("/gallery/person")}
              />
            )}
            {hasValidImages(garment) && (
              <FolderCard
                title="Garment"
                images={garment}
                onClick={() => router.push("/gallery/garment")}
              />
            )}
            {hasValidImages(results) && (
              <FolderCard
                title="Results"
                images={results}
                onClick={() => router.push("/gallery/results")}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[90vh] text-gray-500 space-y-3 text-center px-4">
            <HiOutlinePhotograph className="w-16 h-16 text-gray-400" />
            <h2 className="text-xl font-semibold">No Images Found</h2>
            <p>Looks like you haven’t generated any images yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
