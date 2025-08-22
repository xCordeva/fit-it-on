"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";
import { useCanvasImageDrawer } from "@/hooks/useCanvasImageDrawer";
import { DownloadButton } from "./DownloadButton";
import { useModalStore } from "@/stores/useModalStore";

interface TryOnResultProps {
  result: string[];
  onReset: () => void;
}

export function TryOnResult({ result, onReset }: TryOnResultProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element

  const drawImage = useCanvasImageDrawer();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const thumbnailRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const { setShowUploadGuideModal } = useModalStore();
  // Draw main result image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && result[selectedIndex]) {
      drawImage(canvas, result[selectedIndex]);
    }
  }, [selectedIndex, result, drawImage]);

  const drawnThumbnails = useRef<Map<number, boolean>>(new Map());

  useEffect(() => {
    result.forEach((url, i) => {
      const thumbCanvas = thumbnailRefs.current[i];
      if (thumbCanvas && !drawnThumbnails.current.get(i)) {
        drawImage(thumbCanvas, url);
        drawnThumbnails.current.set(i, true);
      }
    });
  }, [result, drawImage]);

  return (
    <div className="space-y-6">
      {/* Result Display with Thumbnails on the Right */}
      <div className="flex justify-center gap-6 overflow-hidden p-0">
        {/* Main Image */}
        <div className="relative border-2 border-black rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-64 md:h-[100%] md:max-h-[500px] object-contain bg-gray-100"
            onContextMenu={(e) => {
              e.preventDefault();
              toast.info("Right-click disabled for image protection.");
            }}
          />
          <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm">
            Result
          </div>
        </div>

        {/* Thumbnail List */}
        {result.length > 1 && (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-gray-600">Alternate results</p>
            {result.map((_, i) => (
              <div
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`cursor-pointer border-2 rounded-md ${
                  selectedIndex === i ? "border-primary" : "border-gray-200"
                }`}
              >
                <canvas
                  ref={(el) => {
                    thumbnailRefs.current[i] = el;
                  }}
                  width={64}
                  height={64}
                  className="w-16 h-16 bg-gray-100 object-cover rounded-sm"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toast.info("Right-click disabled for image protection.");
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <DownloadButton result={result[selectedIndex]} canvasRef={canvasRef} />
        <Button onClick={onReset} variant="outline">
          <FaArrowRotateLeft className="mr-2 h-4 w-4" />
          Try Another
        </Button>
      </div>

      {/* Quality Notice */}
      <div className="text-center text-sm bg-yellow-100 text-yellow-800 p-2 rounded-lg w-fit mx-auto ">
        <p className="flex items-center justify-center gap-1">
          <BsInfoCircleFill className="h-3 w-3 flex-shrink-0" />
          Don't like the results? Check our upload guide to get the best results
        </p>
        <div className="text-center">
          <button
            className="text-yellow-900 underline cursor-pointer"
            onClick={() => setShowUploadGuideModal(true)}
          >
            Upload guide
          </button>
        </div>
      </div>

      {/* Quality Notice */}
      <div className="text-center text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
        <p className="flex items-center gap-1">
          <BsInfoCircleFill className="h-3 w-3 flex-shrink-0" />
          For the best results, use clear, well-lit photos with good contrast.
          Pro subscribers enjoy enhanced processing and higher-quality outputs.
        </p>
      </div>
    </div>
  );
}
