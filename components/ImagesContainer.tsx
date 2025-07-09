interface ImagesContainerProps {
  folder: string;
  folderImages: string[];
  loading: boolean;
}

export default function ImagesContainer({
  folder,
  folderImages,
  loading,
}: ImagesContainerProps) {
  return (
    <main className="flex justify-center p-4 md:py-10 bg-[#f2f2f2] md:bg-white rounded-lg md:shadow-xl w-full h-full mb-16 md:mb-auto overflow-auto">
      <div className="max-w-6xl w-full mb-8">
        {" "}
        <h1 className="text-2xl font-bold mb-4 capitalize">{folder} Gallery</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[90vh]">
            <span className="loader"></span>Loading images...
          </div>
        ) : folderImages.length === 0 ? (
          // No images found state
          <p className="text-gray-600">No images found in this folder.</p>
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
      </div>
    </main>
  );
}
