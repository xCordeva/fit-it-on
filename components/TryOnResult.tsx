"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { BsInfoCircleFill } from "react-icons/bs";
import { TOAST_CONFIG } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { useModalStore } from "@/stores/useModalStore";

interface TryOnResultProps {
  result: {
    inputUrl: string;
    garmentUrl: string;
    outputUrl: string;
  };
  onReset: () => void;
}

export function TryOnResult({ result, onReset }: TryOnResultProps) {
  const [loading, setLoading] = useState(false);
  const { setShowUpgradeModal } = useModalStore();
  const isProUser = false;

  const handleDownload = async (quality: "low" | "high") => {
    if (!isProUser && quality === "high") {
      setShowUpgradeModal(true);
      return;
    }
    const urlToDownload =
      quality === "high" ? result.outputUrl : result.outputUrl;
    if (!urlToDownload) {
      toast.error("No image available to download.");
      return;
    }

    try {
      setLoading(true);

      // Fetch original image
      const response = await fetch(urlToDownload);
      const blob = await response.blob();

      // Create Image object
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let finalBlob: Blob;

      if (quality === "low") {
        // Resize
        const canvas = document.createElement("canvas");
        const targetWidth = 512;
        const scale = targetWidth / img.width;
        canvas.width = targetWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert canvas to Blob (JPEG, 80% quality)
        finalBlob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.8)
        );
      } else {
        // Use original blob for high quality
        finalBlob = blob;
      }

      // Download
      const downloadUrl = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `fititon-${quality}-result-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast.success(
        `Downloaded ${
          quality === "high" ? "High" : "Low"
        } Quality image successfully!`,
        { ...TOAST_CONFIG.success }
      );
    } catch (error) {
      toast.error("Failed to download image.", { ...TOAST_CONFIG.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Result Display */}

      <div className="flex items-center justify-center overflow-hidden p-0">
        {/* Result */}
        <div className="relative border-2 border-black rounded-lg overflow-hidden">
          <img
            src="/result.jpg"
            alt="Try-on Result"
            className="w-full h-64 md:h-[100%] md:max-h-[500px] object-cover"
          />
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

              <span className="bg-gray-100 px-2  text-gray-800 rounded-md justify-self-end ml-auto">
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
                <p className="text-gray-500">1024 x 1024</p>
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
