"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { BsInfoCircleFill } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { useCanvasImageDrawer } from "@/hooks/useCanvasImageDrawer";
import { useDownloadTryOnResult } from "@/hooks/useDownloadResult";

interface TryOnResultProps {
  result: string;
  onReset: () => void;
}

export function TryOnResult({ result, onReset }: TryOnResultProps) {
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas element
  const isProUser = false;

  const drawImage = useCanvasImageDrawer();
  const handleDownload = useDownloadTryOnResult(
    isProUser,
    canvasRef,
    result,
    setLoading
  );

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary" disabled={loading}>
              <LuDownload className="mr-2 h-4 w-4" />
              Download
              <IoIosArrowDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleDownload("low")}
              className="flex items-center gap-4 cursor-pointer"
            >
              <FaEye />
              <div>
                <p className="font-semibold">Low Quality</p>{" "}
                <p className="text-gray-500">512 x 512</p>
              </div>
              <span className="bg-gray-100 px-2 text-gray-800 rounded-md justify-self-end ml-auto">
                Free
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload("high")}
              className="flex items-center gap-4 cursor-pointer"
            >
              <LuCrown className="text-yellow-500" />
              <div>
                <p className="font-semibold">Max Quality</p>{" "}
                <p className="text-gray-500">Original Resolution</p>{" "}
                {/* Updated description */}
              </div>
              <span className="bg-yellow-500 px-2 text-gray-800 rounded-md">
                Premium
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onReset} variant="outline">
          <FaArrowRotateLeft className="mr-2 h-4 w-4" />
          Try Another
        </Button>
      </div>

      {/* Quality Notice */}
      <div className="text-center text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
        <p className="flex items-center gap-1">
          <BsInfoCircleFill className="h-3 w-3" />
          For the best results, use clear, well-lit photos with good contrast.
          Pro subscribers enjoy enhanced processing and higher-quality outputs.
        </p>
      </div>
    </div>
  );
}
