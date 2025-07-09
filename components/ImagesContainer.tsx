import { User } from "@supabase/supabase-js";
import { HiOutlinePhotograph } from "react-icons/hi";

interface ImagesContainerProps {
  user: User | null;
  folder: string;
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
          {" "}
          {folderImages.length === 0 ? (
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
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[90vh]">
                  <span className="loader"></span>Loading images...
                </div>
              ) : (
                // Actual Image Grid
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {folderImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="
                  rounded-lg cursor-pointer hover:scale-105 transition-transform
                  border-2 border-gray-400
                  relative overflow-hidden /* Needed for aspect-ratio hack */
                  pb-[100%] /* Padding-bottom hack for 1:1 aspect ratio */
                "
                    >
                      <img
                        src={url}
                        alt={`${folder}-${idx}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
