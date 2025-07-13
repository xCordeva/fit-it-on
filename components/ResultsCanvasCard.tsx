import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { DownloadButton } from "./DownloadButton";
import { useCanvasImageDrawer } from "@/hooks/useCanvasImageDrawer";
import { RiDeleteBinLine } from "react-icons/ri";

interface ResultsCanvasCardProps {
  url: string;
  isActive: boolean;
  onClick: () => void;
  onDownloadClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteClick?: (e: React.MouseEvent<SVGElement>) => void;
}

export function ResultsCanvasCard({
  url,
  isActive,
  onClick,
  onDownloadClick,
  onDeleteClick,
}: ResultsCanvasCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawImage = useCanvasImageDrawer();

  useEffect(() => {
    if (canvasRef.current) {
      drawImage(canvasRef.current, url);
    }
  }, [url]);

  return (
    <div
      className={`group relative rounded-lg cursor-pointer overflow-hidden pb-[100%] transition-transform hover:scale-105 ${
        isActive ? "border-primary ring-2" : "border-gray-400 border-2"
      }`}
      onClick={onClick}
    >
      {onDeleteClick && (
        <div
          className={`absolute top-2 right-2 z-10 transition-all duration-300 ${
            isActive
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          <RiDeleteBinLine
            className="text-red-500 w-5 h-5  hover:scale-110 transition-transform"
            onClick={onDeleteClick}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        onContextMenu={(e) => {
          e.preventDefault();
          toast.info("Right-click disabled for image protection.");
        }}
      />
      <div
        className={`absolute bottom-4 left-0 right-0 flex justify-center transition-all duration-300 ${
          isActive
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
        }`}
      >
        <DownloadButton
          result={url}
          canvasRef={canvasRef}
          onClick={onDownloadClick}
        />
      </div>
    </div>
  );
}
