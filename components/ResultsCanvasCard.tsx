import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { DownloadButton } from "./DownloadButton";
import { useCanvasImageDrawer } from "@/hooks/useCanvasImageDrawer";

interface ResultsCanvasCardProps {
  url: string;
  isActive: boolean;
  onClick: () => void;
  onDownloadClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ResultsCanvasCard({
  url,
  isActive,
  onClick,
  onDownloadClick,
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
