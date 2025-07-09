"use client";

interface FolderCardProps {
  title: string;
  images: string[];

  onClick?: () => void;
}

export default function FolderCard({
  title,
  images,
  onClick,
}: FolderCardProps) {
  // Use the first image as cover
  const coverImage = images[0];

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer w-65 h-65
        flex flex-col overflow-hidden
        shadow-lg
        pointer-events-none
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onClick) onClick();
      }}
    >
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
    </div>
  );
}
