"use client";

interface FolderCardProps {
  title: string;
  images: string[];
  loading: boolean;
  onClick?: () => void;
}

export default function FolderCard({
  title,
  images,
  onClick,
  loading,
}: FolderCardProps) {
  // Use the first image as cover
  const coverImage = images[0];

  return (
    <div
      onClick={loading ? undefined : onClick}
      className={`
        cursor-pointer w-65 h-65
        flex flex-col overflow-hidden
        shadow-lg
        ${loading ? "pointer-events-none" : ""} 
      `}
      role="button"
      tabIndex={loading ? -1 : 0}
      onKeyDown={(e) => {
        if (!loading && e.key === "Enter" && onClick) onClick();
      }}
    >
      {loading ? (
        // Skeleton Loading State
        <>
          <div className="relative flex-1 overflow-hidden folder-shape animate-pulse">
            <div className="folder-tab text-center font-bold text-black animate-pulse "></div>
          </div>
        </>
      ) : (
        <>
          {/* Folder Body with Image */}
          <div className="relative flex-1 overflow-hidden folder-shape">
            <img
              src={coverImage}
              alt={`${title} folder cover`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Folder Tab with Title */}
            <div className="folder-tab text-center font-bold text-black">
              {title}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
