"use client";

import { useModalStore } from "@/stores/useModalStore";
import FolderCard from "@/components/FolderCard";
import { useRouter } from "next/navigation";
import { GalleryStore } from "@/stores/useGalleryStore";
import { User } from "@supabase/supabase-js";

interface GalleryProps
  extends Omit<GalleryStore, "initializeGallery" | "initialized"> {
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
        ) : (
          <div className="flex gap-6 justify-center flex-wrap">
            <FolderCard
              title="Person"
              images={person}
              onClick={() => router.push("/gallery/person")}
              loading={loading}
            />
            <FolderCard
              title="Garment"
              images={garment}
              onClick={() => router.push("/gallery/garment")}
              loading={loading}
            />
            <FolderCard
              title="Results"
              images={results}
              onClick={() => router.push("/gallery/results")}
              loading={loading}
            />
          </div>
        )}
      </div>
    </main>
  );
}
