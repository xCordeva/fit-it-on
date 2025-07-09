"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";
import { useCanvasImageDrawer } from "@/hooks/useCanvasImageDrawer";
import { DownloadButton } from "./DownloadButton";

interface TryOnResultProps {
  result: string;
  onReset: () => void;
}

export function TryOnResult({ result, onReset }: TryOnResultProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element

  const drawImage = useCanvasImageDrawer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && result) {
      drawImage(canvas, result);
    }
  }, [result, drawImage]);

  return (
    <div className="space-y-6">
      {/* Result Display */}
      <div className="flex items-center justify-center overflow-hidden p-0">
        <div className="relative border-2 border-black rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-64 md:h-[100%] md:max-h-[500px] object-contain bg-gray-100"
            onContextMenu={(e) => {
              // Disable right-click on the canvas itself
              e.preventDefault();
              toast.info("Right-click disabled for image protection.");
            }}
          >
            Your browser does not support the canvas element.
          </canvas>
          <div className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-sm">
            Result
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <DownloadButton result={result as string} canvasRef={canvasRef} />

        <Button onClick={onReset} variant="outline">
          <FaArrowRotateLeft className="mr-2 h-4 w-4" />
          Try Another
        </Button>
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
