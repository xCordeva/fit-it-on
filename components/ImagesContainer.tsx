import { User } from "@supabase/supabase-js";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Button } from "./ui/button";
import { useReuseStore } from "@/stores/useReuseStore";
import { useRouter } from "next/navigation";

interface ImagesContainerProps {
  user: User | null;
  folder: "person" | "garment" | "results";
  folderImages: string[];
  loading: boolean;
  setShowSignInModal: (open: boolean) => void;
}

export default function ImagesContainer({
  user,
  folder,
  folderImages,
  loading,
  setShowSignInModal,
}: ImagesContainerProps) {
  const router = useRouter();
  const { setReuseTarget } = useReuseStore();

  return (
    <main className="flex justify-center p-4 md:py-10 bg-[#f2f2f2] md:bg-white rounded-lg md:shadow-xl w-full h-full mb-16 md:mb-auto overflow-auto">
      {!user ? (
        <div className="mb-6 h-fit bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800 shadow-sm w-fit mx-auto">
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
        <div className="max-w-6xl w-full mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[90vh]">
              <span className="loader"></span>Loading images...
            </div>
          ) : folderImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[90vh] text-gray-500 space-y-3 text-center px-4">
              <HiOutlinePhotograph className="w-16 h-16 text-gray-400" />
              <h2 className="text-xl font-semibold">No Images Found</h2>
              <p>Looks like you haven’t generated any images yet.</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4 capitalize">
                {folder} Gallery
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {folderImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="
            group relative rounded-lg cursor-pointer overflow-hidden border-2 border-gray-400 
            pb-[100%] transition-transform hover:scale-105
          "
                  >
                    <img
                      src={url}
                      alt={`${folder}-${idx}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />

                    {folder !== "results" && (
                      <div
                        className="
              absolute bottom-4 left-0 right-0 flex justify-center 
              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
              transition-all duration-300 pointer-events-none
            "
                      >
                        <Button
                          variant="default"
                          size="sm"
                          className="pointer-events-auto shadow-md"
                          onClick={() => {
                            setReuseTarget(url, folder);
                            router.push("/app");
                          }}
                        >
                          Reuse this image
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
